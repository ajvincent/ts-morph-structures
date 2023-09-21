# Roadmap to a published package

The es-membrane prototype was a rush job, basically enough to be usable.  This is a roadmap to go from the prototype to a complete project.

## Requirements

- [Bootstrapping](https://en.wikipedia.org/wiki/Bootstrapping_(compilers)): taking an existing snapshot (the prototype for now) to generate the final set of classes and exports.
- Engine: ts-node, ts-morph
- Testing: jasmine
  - I lost parallel testing with ts-node.  I may try switching to ts-jest, or using `child_process.spawn()` instead.
- Build: my own custom
  - I looked at gulp (npm audit failures), grunt (learning curve) and jake (no ESM support yet).  Crafting my own a couple years ago wasn't _that_ hard.
- Linting: typescript-eslint
- Code documentation: tsdoc
- Bundling: rollup
- Code pretty-printing: Prettier, [ts-pretty](https://www.npmjs.com/package/prettier-plugin-ts-pretty)

## Directory layout

- stage_1_bootstrap:
  - prototype-snapshot: The es-membrane prototype
  - spec-snapshot: Test files for the snapshot or prototype snapshot.
  - fixtures: Test fixtures for the snapshot or prototype snapshot.
  - build: Stage-build files.
    - hooks: Tools using the snapshot to create dist/source files.
  - source: Code to create the output set.
  - dist: The full output set, git-ignored, including exports.
    - source
    - bundle
- stage_2_fullset:
  - build: Stage-build files.
  - snapshot: Copied from stage_1_bootstrap/dist
  - spec-snapshot: Test files for the snapshot.
  - fixtures: Test fixtures for the snapshot.
  - source: Code to create the output set.
  - refactors: Tools using the snapshot to do useful changes to source / fixtures.
  - dist: The full output set, git-ignored, including exports.
    - source
    - bundle
- stage_3_fullset:
  - build: Stage-build files, including export.
  - snapshot: Copied from stage_2_fullset/dist
  - spec-snapshot: Test files for the snapshot.
- dist: the final snapshot.
- utilities: Shared utilities for internal use.

Each stage manages its own requirements, including tests.
