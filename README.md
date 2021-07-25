<p align="center">
  CMG Engineering Audition
</p>

- [About](#about)
- [Getting Started](#getting-started)
- [Assumptions](#assumptions)
- [Limitations](#limitations)

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

Let's start by building the project and then running the library from node.

```sh
$ npm run build
$ node .tools/evaluate-file.js
```

### Commands

```sh
  npm run test # runs the unit tests
  npm run watch # runs the library in watch mode
  npm run build # builds the project
```

This is a monorepo managed with [lerna](https://github.com/lerna/lerna/blob/main/README.md).

```
└── cmg/
  └── packages/
    └── core/
    └── log-parser/
```

## Assumptions

Here are some assumptions that I made when reading the instructions:

- This is a NodeJS library that will be delivered to production, but but due to the alloted time of 2-4 hours I submit this repo as a PoC.
- The log file structure, is tree-like as follows:
```
1 └── reference (root)
2    └── sensor
3      └── entries (leafs)
```
- There is no indication that the log files will be split by the `reference` line, so an assumption was made that multiple _trees_ will appear in a single file; this is typical, as most log files are split by their size.
- The log file structure and generation are not owned by CMG; therefore, some validation will have to take place on the structure of the log file.
- Validating the file entries is specially important since this is a QA tool, fail fast instead of emitting suspect results.
- Log files can be large, so the parsing has to account for performance.
- This library only works in NodeJS and not the browser.

### Limitations

Here are some limitations that my solution has to account for before it can be considered production worthy.

- The `evaluateLogFile` function takes in a string variable that is the contents of the log file itself; I believe a better approach would be to pass a file path and/or stream.
- The sensor types are pretty hardcoded; while keeping good defaults, I would prefer supporting a more _config_ driven approach, were we could pass the sensor types, thresholds and even validators functions as an optional config object. This can have the potential of parsing one-off sensors, and even selecting which sensors we want to parse and which to ignore. Also, the sensor thresholds could come from a different source such as a database or spec file.
- This library is NodeJS only, so it wouldn't work in a browser environment; the library could be made isomorphic and support the FileAPI from the browser if such a feature was required.
- I would've liked to add *JDocs*, at least, in all exported functions, but was running out of time.
- Obviously the monorepo approach is overkill for a PoC, but I would imagine that this library would coexists amongst other libraries and there could/should be some reusability and separation of concerns. This is showcased by using the `core` package that signifies reusing the *core* BLL from _365-Widgets_.
