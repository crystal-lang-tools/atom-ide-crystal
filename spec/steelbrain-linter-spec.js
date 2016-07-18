'use babel';

import path from 'path';

describe('The Crystal provider for AtomLinter', () => {
	const lint = require('../lib/main').provideSteelbrainLinter().lint;

	beforeEach(() => {
		waitsForPromise(() => {
			return atom.packages.activatePackage('crystal');
		});
	});

	it('does not find any errors in "without_errors.cr"', () => {
		waitsForPromise(() => {
			console.log(path.join(__dirname, '/diagnostics-files/without_errors.cr'));
			return atom.workspace.open(path.join(__dirname, '/diagnostics-files/without_errors.cr')).then(editor => {
				return lint(editor).then(messages => {
					expect(messages.length).toEqual(0);
				});
			});
		});
	});

	it('finds an error in "incorrect_method_type.cr"', () => {
		waitsForPromise(() => {
			return atom.workspace.open(path.join(__dirname, '/diagnostics-files/incorrect_method_type.cr')).then(editor => {
				return lint(editor).then(messages => {
					expect(messages.length).toEqual(1);
					expect(messages[0].type).toEqual('Error');
					expect(messages[0].text).toEqual('no overload matches \'accepts_int\' with type String\nOverloads are:\n - accepts_int(int : Int)');
				});
			});
		});
	});

	it('finds an error in "relative_requirement.cr"', () => {
		waitsForPromise(() => {
			return atom.workspace.open(path.join(__dirname, '/diagnostics-files/relative_requirement.cr')).then(editor => {
				return lint(editor).then(messages => {
					expect(messages.length).toEqual(1);
					expect(messages[0].type).toEqual('Error');
					expect(messages[0].text).toEqual('declaring the type of a local variable is not yet supported');
				});
			});
		});
	});

	it('finds an error in "variable_type_already_defined.cr"', () => {
		waitsForPromise(() => {
			return atom.workspace.open(path.join(__dirname, '/diagnostics-files/variable_type_already_defined.cr')).then(editor => {
				return lint(editor).then(messages => {
					expect(messages.length).toEqual(1);
					expect(messages[0].type).toEqual('Error');
					expect(messages[0].text).toEqual('declaring the type of a local variable is not yet supported');
				});
			});
		});
	});

	it('finds no issue in a file dependant on a shard (#19)', () => {
		waitsForPromise(() => {
			return _setupShardsTest().then(() => atom.workspace.open(path.join(__dirname, '/diagnostics-files/shards_test/main.cr')).then(editor => {
				return lint(editor).then(messages => {
					expect(messages.length).toEqual(0);
				});
			}));
		});
	});
});

function _setupShardsTest() {
	return new Promise(resolve => {
		process.chdir(path.join(__dirname, '/diagnostics-files/shards_test'));
		const spawn = require('child_process').spawn;

		const shards = spawn('shards', ['install']);
		shards.stdout.on('data', data => {
			console.log(`shards install: ${data}`);
		});
		shards.on('close', () => {
			resolve();
		});
	});
}
