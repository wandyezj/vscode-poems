# Poems

Poems is a Visual Studio Code Extension to assist poetry writing.

## How it works

The extension is only active on the active markdown file.

Code fences with the type `poems-haiku` directive are display Haiku linting rules.

````text
```poems-haiku
this is your haiku
linting and intellisense
are applied inside
```
````

The first code fence with `poems-data` directive is used to store metadata about words from the [datamuse API](https://www.datamuse.com/api/). This cache is used to reduce load on the datamuse service and to increase lookup speed. You can dump the current set of cached datamuse data to the current markdown file with the Ctrl + Shift + P `Poems Data Save` command.

````text
```poems-data
[]
```
````
