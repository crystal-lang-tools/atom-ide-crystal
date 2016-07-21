'use babel';

import {spawn as _spawn} from 'child_process';

export function spawn(command, args, options = {}) {
	return new Promise((resolve, reject) => {
		const child = _spawn(command, args, options);
		const output = [];
		child.stdout.on('data', data => {
			output.push(data);
		});
		child.on('close', () => {
			resolve(output);
		});
		child.on('error', err => {
			reject(err);
		});
	});
}
