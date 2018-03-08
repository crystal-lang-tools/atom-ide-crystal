import * as cp from "child_process";
import * as fs from "fs";
import * as path from "path";
import { AutoLanguageClient, DownloadFile } from "atom-languageclient";
import { StatusBar, Tile } from "atom/status-bar";
import decompress = require("decompress");

const serverDownload = {
  darwin: {
    url:
      "https://github.com/crystal-lang-tools/scry/releases/download/v0.7.1/scry_macOS.tar.gz"
  },
  linux: {
    url:
      "https://github.com/crystal-lang-tools/scry/releases/download/v0.7.1/scry_linux.tar.gz"
  }
};
const serverBinary = "scry";

class CrystalLanguageServer extends AutoLanguageClient {
  private statusElement: HTMLSpanElement;

  constructor() {
    super();
    this.statusElement = document.createElement("span");
    this.statusElement.className = "inline-block";
  }

  protected getGrammarScopes() {
    return ["source.crystal"];
  }

  protected getLanguageName() {
    return "Crystal";
  }

  protected getServerName() {
    return "scry";
  }

  protected consumeStatusBar(statusBar: StatusBar) {
    statusBar.addRightTile({
      item: this.statusElement,
      priority: 1000
    });
  }

  protected async startServerProcess(projectPath: string) {
    if (!this.isPlatformSupported()) {
      throw new Error(
        `${this.getServerName()} not supported on ${process.platform}`
      );
    }

    const serverHome = path.join(__dirname, "..", "server");

    const binary = await this.getOrInstallLauncher(serverHome);

    this.logger.debug(`starting "${binary} at ${projectPath}"`);
    return cp.spawn(binary, [], { cwd: projectPath });
  }

  private async getOrInstallLauncher(serverHome: string) {
    const fullBinaryPath = path.join(
      serverHome,
      "bin",
      process.platform,
      serverBinary
    );

    if (await this.fileExists(fullBinaryPath)) {
      return fullBinaryPath;
    }

    await this.installServer(serverHome);
    return fullBinaryPath;
  }

  private async installServer(serverHome: string) {
    const localFileName = path.join(serverHome, "download.tar.gz");
    const url = this.getScryDownload();

    this.logger.log(`Downloading ${url} to ${localFileName}`);

    const serverHomeExists = await this.fileExists(serverHome);
    if (!serverHomeExists) {
      new Promise((resolve, reject) => {
        fs.mkdir(serverHome, err => {
          if (err) {
            return reject(err);
          }

          return resolve();
        });
      });
    }

    await DownloadFile(url, localFileName, (bytesDone, percent) =>
      this.updateStatusBar(`downloading ${percent}%`)
    );
    this.updateStatusBar("unpacking");
    await decompress(localFileName, serverHome);

    const serverBinExists = await this.fileExists(
      path.join(serverHome, "bin", process.platform, serverBinary)
    );
    if (!serverBinExists) {
      throw Error(
        `Failed to install the ${this.getServerName()} language server`
      );
    }

    this.updateStatusBar("installed");
    await new Promise((resolve, reject) => {
      fs.unlink(localFileName, err => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  private updateStatusBar(text: string) {
    this.statusElement.textContent = `${this.name} ${text}`;
  }

  private fileExists(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.access(path, fs.constants.R_OK, error => {
        resolve(!error || error.code !== "ENOENT");
      });
    });
  }

  private deleteFileIfExists(path: string) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, error => {
        if (error && error.code !== "ENOENT") {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private isPlatformSupported(): boolean {
    switch (process.platform) {
      case "darwin":
      case "linux":
        return true;
      default:
        return false;
    }
  }

  private getScryDownload(): string {
    switch (process.platform) {
      case "darwin":
      case "linux":
        return serverDownload[process.platform].url;
      default:
        throw new Error(
          `${this.getServerName()} not supported on ${process.platform}`
        );
    }
  }
}

module.exports = new CrystalLanguageServer();
