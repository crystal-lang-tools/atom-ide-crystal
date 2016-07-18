'use babel';

export function activate() {
	console.log('Hello from the new monolithic Crystal package!');
	console.log('This package is not ready for prime-time yet, but I hope you enjoy!');
}

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
