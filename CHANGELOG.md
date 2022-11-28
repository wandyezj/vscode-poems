# Change Log

All notable changes to the "poems" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.0.4] - 2022-11-27

### Changed

- Ignore punctuation at the end of words
- Don't count punctuation as a word

## [0.0.2] - 2022-09-22

### Changed

- Minimize impact on datamuse service by caching misspelled words when no results are found to avoid re-query
- Updated how markers are triggered.

### Fixed

- README example
- Lint markers now update after fixing an issue

## [0.0.1] - 2022-09-21

### Added

- Hovering over a word shows syllables inside a `poems-haiku` block. (`?` indicates syllables are not yet loaded)
- IntelliSense for:
    - too many lines
    - too few lines
    - too many syllables per line
    - too few syllables per line
- `Poems Data Save` command to save current datamuse dataset to the end of the file in a `poems-data` block.
- `Poems Data Load` command to load current datamuse dataset from the first `poems-data` block in the file.
- Automatically load from `poems-data` if present and add to dictionary

## [0.0.0] - 2022-09-19

### Added

- `Poems Version` command to show the current version of the extension.
