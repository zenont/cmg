<p align="center">
  CMG Engineering Audition
</p>

- [About](#about)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- Commands
  - [`npm run test`](./commands/publish#readme)
  - [`lerna version`](./commands/version#readme)
  - [`lerna bootstrap`](./commands/bootstrap#readme)
  - [`lerna list`](./commands/list#readme)
  - [`lerna changed`](./commands/changed#readme)
  - [`lerna diff`](./commands/diff#readme)
  - [`lerna exec`](./commands/exec#readme)
  - [`lerna run`](./commands/run#readme)
  - [`lerna init`](./commands/init#readme)
  - [`lerna add`](./commands/add#readme)
  - [`lerna clean`](./commands/clean#readme)
  - [`lerna import`](./commands/import#readme)
  - [`lerna link`](./commands/link#readme)
  - [`lerna create`](./commands/create#readme)
  - [`lerna info`](./commands/info#readme)
- [Concepts](#concepts)
- [Lerna.json](#lernajson)
- [Global Flags](./core/global-options)
- [Filter Flags](./core/filter-options)

## About

365-Widgets makes inexpensive home sensors such as thermometers, humidistats, and carbon monoxide detectors. In order to spot check the manufacturing process, some units are put in a test environment (for an unspecified amount of time) and their readings are logged. The test environment is controlled with a known temperature, humidity, and CO concentration, but the inexpensive sensors are expected to have some variation with each reading.
As a developer, your task is to process the log files and automate the quality control evaluation. The evaluation criteria are as follows:
1) For a thermometer, it is branded “ultra precise” if the mean of the readings is within 0.5 degrees of the known temperature, and the standard deviation is less than 3. It is branded “very precise” if the mean is within 0.5 degrees of the room, and the standard deviation is under 5. Otherwise, it’s sold as “precise”.
2) For a humidity sensor, it must be discarded unless it is within 1 humidity percent of the reference value for all readings. (All humidity sensor readings are a decimal value representing percent moisture saturation.)
3) For a carbon monoxide detector, it must be discarded unless it is within 3 ppm of the reference value for all readings. (All carbon monoxide readings are an integer value representing parts per million.)
An example log looks like the following. The first line means that the room was held at a constant 70 degrees, 45% relative humidity with 6 ppm carbon monoxide. Subsequent lines either identify a sensor (<type> <name>) or give a reading (<time> <value>).

### Log File Sample

```
reference 70.0 45.0 6
thermometer temp-1
2007-04-05T22:00 72.4
2007-04-05T22:01 76.0
2007-04-05T22:02 79.1
2007-04-05T22:03 75.6
2007-04-05T22:04 71.2
2007-04-05T22:05 71.4
2007-04-05T22:06 69.2
2007-04-05T22:07 65.2
2007-04-05T22:08 62.8
2007-04-05T22:09 61.4
2007-04-05T22:10 64.0
2007-04-05T22:11 67.5
2007-04-05T22:12 69.4
thermometer temp-2
2007-04-05T22:01 69.5
2007-04-05T22:02 70.1
2007-04-05T22:03 71.3
2007-04-05T22:04 71.5
2007-04-05T22:05 69.8
humidity hum-1
2007-04-05T22:04 45.2
2007-04-05T22:05 45.3
2007-04-05T22:06 45.1
humidity hum-2
2007-04-05T22:04 44.4
2007-04-05T22:05 43.9
2007-04-05T22:06 44.9
2007-04-05T22:07 43.8
2007-04-05T22:08 42.1
monoxide mon-1
2007-04-05T22:04 5
2007-04-05T22:05 7
2007-04-05T22:06 9
monoxide mon-2
2007-04-05T22:04 2
2007-04-05T22:05 4
2007-04-05T22:06 10
2007-04-05T22:07 8
2007-04-05T22:08 6
```

### Sample Output

```javascript
{
  "temp-1": "precise", 
  "temp-2": "ultra precise", 
  "hum-1": "keep",
  "hum-2": "discard", 
  "mon-1": "keep",
  "mon-2": "discard"
}
```

## Getting Started

Let's start by building the project and then running the library from a node.

```sh
$ npm run build
$ node .tools/test.js
```

This is a monorepo managed with [lerna](https://github.com/lerna/lerna/blob/main/README.md).

```
cmg/
  packages/
    core/
    log-parser/
```

## Assumptions

Here are some assumptions that I made when reading the instructions:

- This is a NodeJS library that will be delivered to production, but with an alloted time of 2-4 hours; thus I submit this repo as a PoC.
- The log file structure, is tree-like as follows:
```
1  reference (root)
2    sensor
3      entries (leafs)
```
- There is no indication that the log files will be split by the `reference` line, so an assumption was made that multiple _trees_ will appear in a single file; this is typical, as most log files are split by their size.
- The log file structure and generation is not owned by GMC, therefore some validation will have to take place on the structure of the validation.
- Validating the file entries is specially important since this is a QA tool, fail fast instead of emitting suspect results.
- Log files can be large, so the parsing has to account for performance.

### Limitations

Here are some limitations that my solution has before it could be considered production worthy.

- The `

### Independent mode

`lerna init --independent`

Independent mode Lerna projects allows maintainers to increment package versions independently of each other. Each time you publish, you will get a prompt for each package that has changed to specify if it's a patch, minor, major or custom change.

Independent mode allows you to more specifically update versions for each package and makes sense for a group of components. Combining this mode with something like [semantic-release](https://github.com/semantic-release/semantic-release) would make it less painful. (There is work on this already at [atlassian/lerna-semantic-release](https://github.com/atlassian/lerna-semantic-release)).

> Set the `version` key in `lerna.json` to `independent` to run in independent mode.

## Troubleshooting

If you encounter any issues while using Lerna please check out our [Troubleshooting](doc/troubleshooting.md)
document where you might find the answer to your problem.

## Frequently asked questions

See [FAQ.md](FAQ.md).

## Concepts

Lerna will log to a `lerna-debug.log` file (same as `npm-debug.log`) when it encounters an error running a command.

Lerna also has support for [scoped packages](https://docs.npmjs.com/misc/scope).

Run `lerna --help` to see all available commands and options.

### lerna.json

```json
{
  "version": "1.1.3",
  "npmClient": "npm",
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"],
      "message": "chore(release): publish",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
```

- `version`: the current version of the repository.
- `npmClient`: an option to specify a specific client to run commands with (this can also be specified on a per command basis). Change to `"yarn"` to run all commands with yarn. Defaults to "npm".
- `command.publish.ignoreChanges`: an array of globs that won't be included in `lerna changed/publish`. Use this to prevent publishing a new version unnecessarily for changes, such as fixing a `README.md` typo.
- `command.publish.message`: a custom commit message when performing version updates for publication. See [@lerna/version](commands/version#--message-msg) for more details.
- `command.publish.registry`: use it to set a custom registry url to publish to instead of
  npmjs.org, you must already be authenticated if required.
- `command.bootstrap.ignore`: an array of globs that won't be bootstrapped when running the `lerna bootstrap` command.
- `command.bootstrap.npmClientArgs`: array of strings that will be passed as arguments directly to `npm install` during the `lerna bootstrap` command.
- `command.bootstrap.scope`: an array of globs that restricts which packages will be bootstrapped when running the `lerna bootstrap` command.
- `packages`: Array of globs to use as package locations.

The packages config in `lerna.json` is a list of globs that match directories containing a `package.json`, which is how lerna recognizes "leaf" packages (vs the "root" `package.json`, which is intended to manage the dev dependencies and scripts for the entire repo).

By default, lerna initializes the packages list as `["packages/*"]`, but you can also use another directory such as `["modules/*"]`, or `["package1", "package2"]`. The globs defined are relative to the directory that `lerna.json` lives in, which is usually the repository root. The only restriction is that you can't directly nest package locations, but this is a restriction shared by "normal" npm packages as well.

For example, `["packages/*", "src/**"]` matches this tree:

```
packages/
├── foo-pkg
│   └── package.json
├── bar-pkg
│   └── package.json
├── baz-pkg
│   └── package.json
└── qux-pkg
    └── package.json
src/
├── admin
│   ├── my-app
│   │   └── package.json
│   ├── stuff
│   │   └── package.json
│   └── things
│       └── package.json
├── profile
│   └── more-things
│       └── package.json
├── property
│   ├── more-stuff
│   │   └── package.json
│   └── other-things
│       └── package.json
└── upload
    └── other-stuff
        └── package.json
```

Locating leaf packages under `packages/*` is considered a "best-practice", but is not a requirement for using Lerna.

#### Legacy Fields

Some `lerna.json` fields are no longer in use. Those of note include:

- `lerna`: originally used to indicate the current version of Lerna. [Made obsolete](https://github.com/lerna/lerna/pull/1122) and [removed](https://github.com/lerna/lerna/pull/1225) in v3

### Common `devDependencies`

Most `devDependencies` can be pulled up to the root of a Lerna repo with `lerna link convert`

The above command will automatically hoist things and use relative `file:` specifiers.

Hoisting has a few benefits:

- All packages use the same version of a given dependency
- Can keep dependencies at the root up-to-date with an automated tool such as [Snyk](https://snyk.io/)
- Dependency installation time is reduced
- Less storage is needed

Note that `devDependencies` providing "binary" executables that are used by
npm scripts still need to be installed directly in each package where they're
used.

For example the `nsp` dependency is necessary in this case for `lerna run nsp`
(and `npm run nsp` within the package's directory) to work correctly:

```json
{
  "scripts": {
    "nsp": "nsp"
  },
  "devDependencies": {
    "nsp": "^2.3.3"
  }
}
```

### Git Hosted Dependencies

Lerna allows target versions of local dependent packages to be written as a [git remote url](https://docs.npmjs.com/cli/install) with a `committish` (e.g., `#v1.0.0` or `#semver:^1.0.0`) instead of the normal numeric version range.
This allows packages to be distributed via git repositories when packages must be private and a [private npm registry is not desired](https://www.dotconferences.com/2016/05/fabien-potencier-monolithic-repositories-vs-many-repositories).

Please note that lerna does _not_ perform the actual splitting of git history into the separate read-only repositories. This is the responsibility of the user. (See [this comment](https://github.com/lerna/lerna/pull/1033#issuecomment-335894690) for implementation details)

```
// packages/pkg-1/package.json
{
  name: "pkg-1",
  version: "1.0.0",
  dependencies: {
    "pkg-2": "github:example-user/pkg-2#v1.0.0"
  }
}

// packages/pkg-2/package.json
{
  name: "pkg-2",
  version: "1.0.0"
}
```

In the example above,

- `lerna bootstrap` will properly symlink `pkg-2` into `pkg-1`.
- `lerna publish` will update the committish (`#v1.0.0`) in `pkg-1` when `pkg-2` changes.

### README Badge

Using Lerna? Add a README badge to show it off: [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

```
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
```

### Wizard

If you prefer some guidance for cli (in case you're about to start using lerna or introducing it to a new team), you might like [lerna-wizard](https://github.com/szarouski/lerna-wizard). It will lead you through a series of well-defined steps:

![lerna-wizard demo image](https://raw.githubusercontent.com/szarouski/lerna-wizard/2e269fb5a3af7100397a1f874cea3fa78089486e/demo.png)