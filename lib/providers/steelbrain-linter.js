'use babel';

import {getBuildJSON} from '../util/compiler';

export default function lint(activeEditor) {
	return new Promise((resolve, reject) => {
		getBuildJSON(activeEditor.getPath()).then(output => {
			if (output.length === 0) {
				return resolve([]);
			}

			const decoder = new TextDecoder('utf-8');
			try {
				const result = output
					.map(data => {
						return decoder.decode(data);
					})
					.map(json => {
						return JSON.parse(json);
					})
					.reduce((a, b) => {
						return a.concat(b);
					}, [])
					.map(issue => {
						return {
							type: 'Error',
							text: issue.message,
							filePath: issue.file,
							range: [
								[issue.line - 1, issue.column - 1],
								[issue.line - 1, issue.column + issue.size - 1]
							]
						};
					});

				return resolve(result);
			} catch (err) {
				return reject(err);
			}
		});
	});
}
