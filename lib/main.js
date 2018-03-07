"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const atom_languageclient_1 = require("atom-languageclient");
const decompress = require("decompress");
const serverDownload = {
    darwin: {
        url: "https://github.com/crystal-lang-tools/scry/releases/download/v0.7.0/scry_macOS.tar.gz"
    },
    linux: {
        url: "https://github.com/crystal-lang-tools/scry/releases/download/v0.7.0/scry_linux.tar.gz"
    }
};
const serverBinary = "scry";
class CrystalLanguageServer extends atom_languageclient_1.AutoLanguageClient {
    constructor() {
        super();
        this.statusElement = document.createElement("span");
        this.statusElement.className = "inline-block";
    }
    getGrammarScopes() {
        return ["source.crystal"];
    }
    getLanguageName() {
        return "Crystal";
    }
    getServerName() {
        return "scry";
    }
    consumeStatusBar(statusBar) {
        statusBar.addRightTile({
            item: this.statusElement,
            priority: 1000
        });
    }
    startServerProcess(projectPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isPlatformSupported()) {
                throw new Error(`${this.getServerName()} not supported on ${process.platform}`);
            }
            const serverHome = path.join(__dirname, "..", "server");
            const binary = yield this.getOrInstallLauncher(serverHome);
            this.logger.debug(`starting "${binary} at ${projectPath}"`);
            return cp.spawn(binary, [], { cwd: projectPath });
        });
    }
    getOrInstallLauncher(serverHome) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullBinaryPath = path.join(serverHome, "bin", process.platform, serverBinary);
            if (yield this.fileExists(fullBinaryPath)) {
                return fullBinaryPath;
            }
            yield this.installServer(serverHome);
            return fullBinaryPath;
        });
    }
    installServer(serverHome) {
        return __awaiter(this, void 0, void 0, function* () {
            const localFileName = path.join(serverHome, "download.tar.gz");
            const url = this.getScryDownload();
            this.logger.log(`Downloading ${url} to ${localFileName}`);
            const serverHomeExists = yield this.fileExists(serverHome);
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
            yield atom_languageclient_1.DownloadFile(url, localFileName, (bytesDone, percent) => this.updateStatusBar(`downloading ${percent}%`));
            this.updateStatusBar("unpacking");
            yield decompress(localFileName, serverHome);
            const serverBinExists = yield this.fileExists(path.join(serverHome, "bin", process.platform, serverBinary));
            if (!serverBinExists) {
                throw Error(`Failed to install the ${this.getServerName()} language server`);
            }
            this.updateStatusBar("installed");
            yield new Promise((resolve, reject) => {
                fs.unlink(localFileName, err => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            });
        });
    }
    updateStatusBar(text) {
        this.statusElement.textContent = `${this.name} ${text}`;
    }
    fileExists(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, fs.constants.R_OK, error => {
                resolve(!error || error.code !== "ENOENT");
            });
        });
    }
    deleteFileIfExists(path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, error => {
                if (error && error.code !== "ENOENT") {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    isPlatformSupported() {
        switch (process.platform) {
            case "darwin":
            case "linux":
                return true;
            default:
                return false;
        }
    }
    getScryDownload() {
        switch (process.platform) {
            case "darwin":
            case "linux":
                return serverDownload[process.platform].url;
            default:
                throw new Error(`${this.getServerName()} not supported on ${process.platform}`);
        }
    }
}
module.exports = new CrystalLanguageServer();
