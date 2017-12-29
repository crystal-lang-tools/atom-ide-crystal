'use babel';

import {BufferedProcess} from 'atom';

export function register(subscriptions) {
	subscriptions.add(atom.workspace.observeTextEditors(editor => {
		subscriptions.add(editor.onDidSave(evt => {
			if (editor.getGrammar().scopeName !== 'source.crystal') {
				return;
			}
			if (!atom.config.get('ide-crystal.formatOnSave')) {
				return;
			}
			format(evt.path);
		}));
	}));
}

function format(file) {
	const command = atom.config.get('ide-crystal.compilerExecPath');
	const args = ['tool', 'format', file];

	return new BufferedProcess({command, args});
}
