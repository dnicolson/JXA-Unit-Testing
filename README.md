# Unit Testing JXA

This is an experiment in writing a JXA script that can be run unmodified by OSA, Node and Jest. As of ES2019 it appears to [not be possible](https://stackoverflow.com/questions/56592950/mocking-jxa-calls-with-the-proxy-object) use the Proxy object to mock JXA calls as method calls and properties are indistinguishable. Dependency inversion can be used to make method wrappers for the JXA and testing environment. 

A very old AppleScript that updates missing track counts in iTunes has been rewritten in JXA and tested with Jest at about 1/3 of the size of the old script.

The code can be run without modification in the following environments:

### OSA

- `osascript -l JavaScript set-track-counts.js`
- `cp set-track-counts.js set-track-counts.applescript && open -a "Script Editor" set-track-counts.applescript`

### Node

- `node set-track-counts.js`

### Jest

- `jest set-track-counts.test.js`
