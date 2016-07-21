'use babel';

export function activate() {}

export function provideSteelbrainLinter() {
	const lint = require('./providers/steelbrain-linter');

	return {
		name: 'Crystal', // steelbrain + Nuclide
		providerName: 'Crystal', // Nuclide
		grammarScopes: ['source.crystal'], // steelbrain + Nuclide
		scope: 'file', // steelbrain + Nuclude
		lintOnFly: false, // steelbrain + Nuclide
		disabledForNuclide: false, // Nuclide TODO: set to true when Nuclide's diagnostics provider is written
		allGrammarScopes: false, // Nuclide
		lint // steelbrain + Nuclide
	};
}
