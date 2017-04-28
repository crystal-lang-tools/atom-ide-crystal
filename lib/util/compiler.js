'use babel';

import {spawn} from './process';

//   ____                      _ _             ____                 _ _
//  / ___|___  _ __ ___  _ __ (_) | ___ _ __  |  _ \ ___  ___ _   _| | |_ ___
// | |   / _ \| '_ ` _ \| '_ \| | |/ _ \ '__| | |_) / _ \/ __| | | | | __/ __|
// | |__| (_) | | | | | | |_) | | |  __/ |    |  _ <  __/\__ \ |_| | | |_\__ \
//  \____\___/|_| |_| |_| .__/|_|_|\___|_|    |_| \_\___||___/\__,_|_|\__|___/
//                      |_|

export function getBuildJSON(filePath) {
	return new Promise(resolve => {
		const command = atom.config.get('crystal.compilerExecPath');
		const args = getCommandArguments(filePath);
		createProperCrystalPath().then(path => {
			const env = Object.assign({}, process.env, {CRYSTAL_PATH: path});
			spawn(command, args, {env}).then(output => {
				resolve(output);
			});
		});
	});
}

//   ____                                          _   ____        _ _     _ _
//  / ___|___  _ __ ___  _ __ ___   __ _ _ __   __| | | __ ) _   _(_) | __| (_)_ __   __ _
// | |   / _ \| '_ ` _ \| '_ ` _ \ / _` | '_ \ / _` | |  _ \| | | | | |/ _` | | '_ \ / _` |
// | |__| (_) | | | | | | | | | | | (_| | | | | (_| | | |_) | |_| | | | (_| | | | | | (_| |
//  \____\___/|_| |_| |_|_| |_| |_|\__,_|_| |_|\__,_| |____/ \__,_|_|_|\__,_|_|_| |_|\__, |
//                                                                                   |___/

export function getCommandArguments(filePath) {
	const args = [];
	args.push(atom.config.get('crystal.diagnosticsCommand'));
	if (!atom.config.get('crystal.artifactsDuringDiagnostics')) {
		args.push('--no-codegen');
	}
	if (!atom.config.get('crystal.compilerColorOutput')) {
		args.push('--no-color');
	}
	args.push('-f', 'json');
	args.push(filePath);
	return args;
}

//  ____       _   _       _   _                 _ _ _
// |  _ \ __ _| |_| |__   | | | | __ _ _ __   __| | (_)_ __   __ _
// | |_) / _` | __| '_ \  | |_| |/ _` | '_ \ / _` | | | '_ \ / _` |
// |  __/ (_| | |_| | | | |  _  | (_| | | | | (_| | | | | | | (_| |
// |_|   \__,_|\__|_| |_| |_| |_|\__,_|_| |_|\__,_|_|_|_| |_|\__, |
//                                                           |___/

export function createProperCrystalPath() {
	const projectPath = `${atom.project.getPaths()[0]}/libs`;
	return new Promise(resolve => {
		findDefaultCrystalPath().then(output => {
			resolve(`${output}:${projectPath}`);
		});
	});
}

export function findDefaultCrystalPath() {
	const regex = /CRYSTAL_PATH="(.*)"\n/;
	const spawn = require('child_process').spawn;

	let output = '';

	return new Promise(resolve => {
		const command = spawn('crystal', ['env']);
		command.stdout.on('data', data => {
			output = data.toString();
		});
		command.on('close', () => {
			const match = regex.exec(output);
			if (!match && match.length === 2) {
				resolve(match[1]);
			}
		});
	});
}
