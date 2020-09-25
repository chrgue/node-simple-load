#! /usr/bin/env node

const autocannon = require('autocannon');
const argv = require('minimist')(process.argv.slice(2));

let testRun = null;
let index = 0;

const connections = [1, 5, 10, 30, 50, 80, 100];
let duration = 30;
let url = "http://localhost:3000"

if (argv.duration && Number.isInteger(argv.duration)) {
    duration = argv.duration;
}

if (argv.url) {
    url = argv.url;
}

process.once('SIGINT', () => {
    if (testRun) {
        testRun.stop()
        console.log("\n*** Test canceled! ***\n")
        process.exit()
    }
});

function start() {

    if (index <= connections.length - 1) {

        testRun = autocannon({
            url: url,
            connections: connections[index],
            duration: duration
        });

        autocannon.track(testRun);

        testRun.then(() => {
            console.log("next")
            index++;
            start();
        });
    } else {
        console.log("\n*** Test finished! ***\n")
    }
}

console.log(`\n*** Starting ${connections.length} benchmarks for ${url} with ${connections} connections where each runs ${duration} seconds. ***\n`);

start();





