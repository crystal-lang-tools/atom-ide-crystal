'use babel';

import {getBuildJSON} from '../util/compiler';

export default function lint(activeEditor) {
	return new Promise(resolve => {
		getBuildJSON(activeEditor.getPath()).then(output => {
			try {
				resolve(JSON.parse(output).map(issue => {
					return {
						type: 'Error',
						text: issue.message,
						filePath: issue.file,
						range: [
							[issue.line - 1, issue.column - 1],
							[issue.line - 1, issue.column + issue.size - 1]
						]
					};
				}));
			} catch (err) {
				console.log(err);
				resolve([]); // Resolve empty array when the JSON parser has issue
			}
		});
	});
}
