/* eslint-env node, mocha */

// const assert = require('assert');
require('should');
const {optimize} = require('../index.js');


it('is a function', function(){
  optimize.should.be.a.Function();
});
it('should throw if v and c are undefined', function(){
  function bad(){
    return optimize({choices:[[100,1]]});
  }
  bad.should.throw(Error);
});
it('should return {price:100, expectedProfit:0} for v or c =100 at no choices', function(){
  const trivial = {
    price: 100,
    expectedProfit: 0
  };
  optimize({v:100,choices:[]}).should.deepEqual(trivial);
  optimize({c:100,choices:[]}).should.deepEqual(trivial);
});
describe('8 trade uniform case', function(){
  const desc = new Array(8).fill(0).map((v,j)=>([275-25*j,0.125*(j+1)]));
  const asc = new Array(8).fill(0).map((v,j)=>([100+25*j,0.125*(j+1)]));
  const buyTests = [
    [100,100,0],
    [150,125,6.25],
    [200,150,18.75],
    [250,175,37.5],
    [300,200,62.5],
    [350,225,93.75],
    [400,250,131.25],
    [450,275,175],
    [500,275,225],
    [600,275,325]
  ];
  const sellTests = [
    [0,150,112.5],
    [50,175,78.125],
    [100,200,50],
    [150,225,28.125],
    [200,250,12.5],
    [250,275,3.125],
    [300,300,0]
  ];
  buyTests.forEach(([v,price,expectedProfit])=>{
    it(`optimizes buying v=${v}`, function(){
      optimize({v,choices:asc}).should.deepEqual({
        price,
        expectedProfit
      });
    });
  });
  sellTests.forEach(([c,price,expectedProfit])=>{
    it(`optimizes selling c=${c}`, function(){
      optimize({c,choices:desc}).should.deepEqual({
        price,
        expectedProfit
      });
    });
  });
});
