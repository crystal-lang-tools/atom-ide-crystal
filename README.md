# Crystal for Atom
This is a monolithic Atom package aiming to provide all Crystal IDE functions.

This package is currently in development.

## Features

### Diagnostics

This package provides diagnostic information for compilation errors in your Crystal source code, usable by two different consumer packages for Atom:

- [Nuclude](https://atom.io/packages/nuclide) by Facebook
- [linter](https://atom.io/packages/linter) by steelbrain

### Test Running

In the future this package will make use of the Crystal compiler's test running functionality and show you your passing and failing tests in the editor.

### Click-to-Definition

In the future this package will make use of the Crystal compiler's implementation finding functionality to bring you click-to-definition in your text editor.

### Autocomplete

In the future this package will provide autocomplete suggestions for your Crystal project.

### Code Formatting

In the future this package will make use of the Crystal compiler's code formatting functionality, allowing you to format your code right from the text editor.

### Shards Integration

In the future this package will integrate with your Crystal projects Shard spec in order to ensure your project is setup and up to date.

### Syntax Highlighting

In the future this packages aims to use the parser in the Crystal Standard Library to highlight code - a lot like how Xcode highlights C, C++, Objective-C, Objective-C++, Swift code.

## Relationship to Other Crystal Packages

### Relationship to `linter-crystal`

This package replaces `linter-crystal`.

### Relationship to `language-crystal`

The package `language-crystal` is not available for download and installation. This package is.

### Relationship to `language-crystal-actual`

This package will not replace `language-crystal-actual`.

`language-crystal-actual` is meant to be basic regex-based syntax highlighting. This package aims to provide parser-based syntax-highlighting.


### Relationship to `crystal-tools`

Unlike `crystal-tools` this package aims to deeply integrate Crystal in the text editor, bringing you IDE functionality.
