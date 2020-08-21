/* eslint-env node, mocha */

const assert = require('assert');
require('should');
const {TradeTimingStrategy} = require('../index.js');

let tradeAdvisor = null;
beforeEach(function(){
  tradeAdvisor = new TradeTimingStrategy();
});
it('is a (constructor) function', function(){
  TradeTimingStrategy.should.be.a.Function();
});
it('has a method newPeriod', function(){
  tradeAdvisor.newPeriod.should.be.a.Function();
});
it('has a method newTrade', function(){
  tradeAdvisor.newTrade.should.be.a.Function();
});
it('calling newTrade(50) before calling newPeriod throws an Error', function(){
  function bad(){
    tradeAdvisor.newTrade(50);
  }
  bad.should.throw(Error);
});
it('newPeriod() returns self', function(){
  tradeAdvisor.newPeriod().should.equal(tradeAdvisor);
});
it('newTrade() throws RangeError()', function(){
  tradeAdvisor.newPeriod();
  function bad(){
    tradeAdvisor.newTrade();
  }
  bad.should.throw(RangeError);
});
it('newTrade(-3) throws RangeError()', function(){
  tradeAdvisor.newPeriod();
  function bad(){
    tradeAdvisor.newTrade(-3);
  }
  bad.should.throw(RangeError);
});
it('has a method suggestedBid', function(){
  tradeAdvisor.suggestedBid.should.be.a.Function();
});
it('.suggestedBid() throws RangeError', function(){
  tradeAdvisor.newPeriod();
  function bad(){
    tradeAdvisor.suggestedBid();
  }
  bad.should.throw(RangeError);
});
it('.suggestedBid(100) returns undefined', function(){
  tradeAdvisor.newPeriod();
  assert.ok(tradeAdvisor.suggestedBid(100)===undefined);
});
it('.suggestedBid(100,{currentBid:10}) returns undefined', function(){
  tradeAdvisor.newPeriod();
  assert.ok(tradeAdvisor.suggestedBid(100,{currentBid:10})===undefined);
});
it('.suggestedBid(100,{currentAsk:200}) returns undefined', function(){
  tradeAdvisor.newPeriod();
  assert.ok(tradeAdvisor.suggestedBid(100,{currentAsk:200})===undefined);
});
it('.suggestedBid(100,{currentBid:10,smooth:0.001}) returns undefined', function(){
  tradeAdvisor.newPeriod();
  assert.ok(tradeAdvisor.suggestedBid(100,{currentBid:10,smooth:0.001})===undefined);
});
it('.suggestedBid(100,{currentAsk:200,smooth:0.001}) returns undefined', function(){
  tradeAdvisor.newPeriod();
  assert.ok(tradeAdvisor.suggestedBid(100,{currentAsk:200,smooth:0.001})===undefined);
});
it('.suggestedBid(100,{currentBid:39,currentAsk:40,smooth:0.001}) returns 40', function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.suggestedBid(100,{currentBid:39,currentAsk:40,smooth:0.001}).should.equal(40);
});
it('.suggestedBid(100,{currentBid:38,currentAsk:40,smooth:0.001}) returns 40', function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.suggestedBid(100,{currentBid:38,currentAsk:40,smooth:0.001}).should.equal(40);
});
it('.suggestedBid(100,{currentBid:1,currentAsk:40,smooth:0.001}) returns 40', function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.suggestedBid(100,{currentBid:1,currentAsk:40,smooth:0.001}).should.equal(40);
});
it('.suggestedBid(100,{currentBid:10,currentAsk:70,smooth:0.001}) returns 55', function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.suggestedBid(100,{currentBid:10,currentAsk:70,smooth:0.001}).should.equal(55);
});
it('.suggestedBid(100,{currentBid:10,currentAsk:500,smooth:0.001}) returns 55', function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.suggestedBid(100,{currentBid:10,currentAsk:500,smooth:0.001}).should.equal(55);
});
it('has a method suggestedAsk',function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.suggestedAsk.should.be.a.Function();
});
it('.suggestedAsk() throws RangeError', function(){
  function bad(){
    tradeAdvisor.suggestedAsk();
  }
  bad.should.throw(RangeError);
});
it('.suggestedAsk(100) returns undefined', function(){
  tradeAdvisor.newPeriod();
  assert.ok(tradeAdvisor.suggestedAsk(100)===undefined);
});
it('.suggestedAsk(50,{currentBid:100,currentAsk:200,smooth:0.001}) returns 125', function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.suggestedAsk(50,{currentBid:100,currentAsk:200,smooth:0.001}).should.equal(125);
});
it('.suggestedAsk(80,{currentBid:100,currentAsk:119,smooth:0.001}) returns 100', function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.suggestedAsk(80,{currentBid:100,currentAsk:119,smooth:0.001}).should.equal(100);
});
it('.pricesWithProbabilities(1) returns []', function(){
  tradeAdvisor.newPeriod();
  tradeAdvisor.pricesWithProbabilities(1).should.deepEqual([]);
});
