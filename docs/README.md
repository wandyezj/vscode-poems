# Poems

Poems is a Visual Studio Code Extension to assist poetry writing.

## Contents

[How it works](#how-it-works)

[Technical](#technical)

[Privacy Statement](#privacy)

## Powered by

[![datamuse logo](https://www.datamuse.com/api/datamuse-logo-rgb.png "datamuse logo")](https://www.datamuse.com/)

## How it works

The extension actives on opening a markdown file (defines as a file that end in `.md`).

Code fences with the type `poems-haiku` display Haiku linting rules.

````text
```poems-haiku
this is your haiku
linting and intellisense
are applied inside
```
````

## Technical

Words inside of the fence are looked up first in a [cache](#cache) and if not found are looked up using the [datamuse API](#datamuse-api) and then cached.

### Cache

An in memory cache of word data is used to reduce load on the datamuse service and to increase lookup speed.

The in memory set of cached data can be saved to the current markdown file in a code fence `poems-data` block with the Ctrl + Shift + P `Poems Data Save` command. If no block already exists a block is created at the end of the file otherwise the contents of the first `poems-data` block is replaced.

Example empty `poems-data` block:

````text
```poems-data
[]
```
````

Each time the extension starts this `poems-data` block is loaded as the basis of the in memory cache cache.

### Datamuse API

The [datamuse API](https://www.datamuse.com/api/) is used to query for information about words like `syllables`.

## Privacy

The vscode extension code only sends individual words to the [Datamuse API](https://www.datamuse.com/api/).

Datamuse API Privacy Statement

> The Datamuse API servers keep a temporary log file of the queries made to the service. This log file is discarded at the end of the day after the request was made. We save no long-term usage data other than a count of the number of requests broken out by the broad category of the request.
