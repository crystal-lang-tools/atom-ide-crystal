'use babel';

export default function lint(activeEditor) {
	return new Promise(resolve => {
		const command = atom.config.get('crystal.compilerExecPath');
		const args = _getCommandArguments(activeEditor);
		_createProperCrystalPath().then(output => {
			process.env.CRYSTAL_PATH = output;
			resolve(_spawn(command, args).then(output => {
				const result = [];
				try {
					for (const issue of JSON.parse(output)) {
						result.push({
							type: 'Error',
							text: issue.message,
							filePath: issue.file,
							range: [
								[issue.line - 1, issue.column - 1],
								[issue.line - 1, issue.column + issue.size - 1]
							]
						});
					}
				} catch (err) {}
				return result;
			}));
		});
	});
}

function _spawn(command, args, options = {}) {
	const spawn = require('child_process').spawn;

	return new Promise(resolve => {
		const child = spawn(command, args, options);
		const output = [];
		child.stdout.on('data', data => {
			output.push(data);
		});
		child.on('close', () => {
			resolve(output);
		});
	});
}

function _getCommandArguments(activeEditor) {
	const args = [];
	args.push(atom.config.get('crystal.diagnosticsCommand'));
	if (!atom.config.get('crystal.artifactsDuringDiagnostics')) {
		args.push('--no-codegen');
	}
	if (!atom.config.get('crystal.compilerColorOutput')) {
		args.push('--no-color');
	}
	args.push('-f', 'json');
	args.push(activeEditor.getPath());
	return args;
}

//	Crystal Path Handling

function _createProperCrystalPath() {
	const projectPath = `${atom.project.getPaths()[0]}/libs`;
	return new Promise(resolve => {
		_findDefaultCrystalPath().then(output => {
			resolve(`${output}:${projectPath}`);
		});
	});
}

function _findDefaultCrystalPath() {
	const regex = /CRYSTAL_PATH="(.*)"\n/;
	let match;
	const spawn = require('child_process').spawn;

	return new Promise(resolve => {
		const command = spawn('crystal', ['env']);
		command.stdout.on('data', data => {
			match = regex.exec(data.toString())[1];
		});
		command.on('close', () => {
			resolve(match);
		});
	});
}
