/* eslint-env node, mocha */

// const assert = require('assert');
require('should');
const {weight} = require('../index.js');

it('is a function', function(){
  weight.should.be.a.Function();
});
it('weight(null,23) should be 0', function(){
  weight(null,23).should.equal(0);
});
describe('data = [[1,0],[2,1],[3,5],[4,2],[6,1]]', function(){
  const data = [[1,0],[2,1],[3,5],[4,2],[6,1]];
  [
    [0,0],
    [1,0],
    [2,1],
    [2.5,0],
    [3,5],
    [4,2],
    [5,0],
    [6,1],
    [7,0]
  ].forEach((test)=>{
    it(`weight(data,${test[0]}) should be ${test[1]}`, function(){
      weight(data,test[0]).should.equal(test[1]);
    });
  });
});
