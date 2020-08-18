/* eslint-env node, mocha */

function include(name) {
    describe(name, function () {
        require(`./${name}.js`);  // eslint-disable-line global-require
    });
}

const testFiles = [
  'weight',
  'optimize',
  'emptyTradeTimingStrategy',
  'singlePeriodTradeTimingStrategy'
];

testFiles.forEach(include);
