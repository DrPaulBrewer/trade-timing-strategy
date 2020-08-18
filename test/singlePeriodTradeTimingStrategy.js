/* eslint-env node, mocha */

const assert = require('assert');
require('should');
const {byPriceAscending, byPriceDescending, TradeTimingStrategy} = require('../index.js');


describe('[single period, 4 trades: p=130,110,125,140]', function(){
  let tradeAdvisor = null;
  beforeEach(function(){
    tradeAdvisor = new TradeTimingStrategy();
    tradeAdvisor
      .newPeriod()
      .newTrade(130)
      .newTrade(110)
      .newTrade(125)
      .newTrade(140)
      .newPeriod();
  });
  it('.pricesWithProbabilities(1,{sort: byPriceAscending}) should be [[130,1]]', function(){
    tradeAdvisor.pricesWithProbabilities(1,{sort:byPriceAscending}).should.deepEqual([[130,1]]);
  });
  it('.pricesWithProbabilities(2,{sort:byPriceAscending}) should be [[110,1]]', function(){
    tradeAdvisor.pricesWithProbabilities(2,{sort:byPriceAscending}).should.deepEqual([[110,1]]);
  });
  it('.pricesWithProbabilities(3,{sort:byPriceAscending}) should be [[125,1]]', function(){
    tradeAdvisor.pricesWithProbabilities(3,{sort:byPriceAscending}).should.deepEqual([[125,1]]);
  });
  it('.pricesWithProbabilities(4,{sort:byPriceAscending}) should be [[140,1]]', function(){
    tradeAdvisor.pricesWithProbabilities(4,{sort:byPriceAscending}).should.deepEqual([[140,1]]);
  });
  it('.pricesWithProbabilities(5,{sort:byPriceAscending}) should be []', function(){
    tradeAdvisor.pricesWithProbabilities(5,{sort:byPriceAscending}).should.deepEqual([]);
  });
  it('2nd period 1st trade @ 150, .pricesWithProbabilities(1) should be [[130,0.5],[150,1]]', function(){
    tradeAdvisor.newTrade(150);
    tradeAdvisor.pricesWithProbabilities(1,{sort:byPriceAscending}).should.deepEqual([[130,0.5],[150,1]]);
  });
  it('2nd period 1st trade @ 150, .pricesWithProbabilities(1,{sort:byPriceDescending}) should be [[130,0.5],[150,1]]', function(){
    tradeAdvisor.newTrade(150);
    tradeAdvisor.pricesWithProbabilities(1, {sort:byPriceDescending}).should.deepEqual([[150,0.5],[130,1]]);
  });
  it('2nd period 1st trade @ 130, .pricesWithProbabilities(1) should be [[130,1]]', function(){
    tradeAdvisor.newTrade(130);
    tradeAdvisor.pricesWithProbabilities(1, {sort:byPriceAscending}).should.deepEqual([[130,1]]);
  });
  it('.tradeCollator.length should be 5', function(){
    assert.ok(tradeAdvisor.tradeNumber===1);
    tradeAdvisor.tradeCollator.length.should.equal(5);
  });
  it('on first trade of period 2, .suggestedBid(100) should be 100', function(){
    assert.ok(tradeAdvisor.suggestedBid(100)===100);
  });
  it('on first trade of period 2, .suggestedBid(150) should be 110', function(){
    assert.ok(tradeAdvisor.tradeNumber===1);
    tradeAdvisor.suggestedBid(150).should.equal(110);
  });
  it('on 2nd trade of period 2, .suggestedBid(150) should be 110', function(){
    tradeAdvisor.newTrade(100);
    assert.ok(tradeAdvisor.tradeNumber===2);
    tradeAdvisor.suggestedBid(150).should.equal(110);
  });
  it('on 3rd trade of period 2, .suggestedBid(150) should be 125', function(){
    tradeAdvisor.newTrade(100).newTrade(100);
    assert.ok(tradeAdvisor.tradeNumber===3);
    tradeAdvisor.suggestedBid(150).should.equal(125);
  });
  it('on 4th trade of period 2, .suggestedBid(150) should be 140', function(){
    tradeAdvisor.newTrade(100).newTrade(100).newTrade(100);
    assert.ok(tradeAdvisor.tradeNumber===4);
    tradeAdvisor.suggestedBid(150).should.equal(140);
  });
  it('on 5th trade of period 2, .suggestedBid(150) should be 140 (period 2 4th trade=150)', function(){
    tradeAdvisor.newTrade(100).newTrade(100).newTrade(100).newTrade(150);
    assert.ok(tradeAdvisor.tradeNumber===5);
    tradeAdvisor.suggestedBid(150).should.equal(140);
  });
  it('on 5th trade of period 2, .suggestedBid(150) should be 100 (period 2 4th trade=100)', function(){
    tradeAdvisor.newTrade(100).newTrade(100).newTrade(100).newTrade(100);
    assert.ok(tradeAdvisor.tradeNumber===5);
    tradeAdvisor.suggestedBid(150).should.equal(100);
  });
  it('on first trade of period 2, .suggestedAsk(100) should be 140', function(){
    assert.ok(tradeAdvisor.suggestedAsk(100)===140);
  });
  it('on first trade of period 2, .suggestedAsk(150) should be 150', function(){
    assert.ok(tradeAdvisor.tradeNumber===1);
    tradeAdvisor.suggestedAsk(150).should.equal(150);
  });
  it('on 2nd trade of period 2, .suggestedAsk(100) should be 140', function(){
    tradeAdvisor.newTrade(100);
    assert.ok(tradeAdvisor.tradeNumber===2);
    tradeAdvisor.suggestedAsk(100).should.equal(140);
  });
  it('on 3rd trade of period 2, .suggestedAsk(100) should be 140', function(){
    tradeAdvisor.newTrade(100).newTrade(100);
    assert.ok(tradeAdvisor.tradeNumber===3);
    tradeAdvisor.suggestedAsk(100).should.equal(140);
  });
  it('on 4th trade of period 2, .suggestedAsk(100) should be 140', function(){
    tradeAdvisor.newTrade(100).newTrade(100).newTrade(100);
    assert.ok(tradeAdvisor.tradeNumber===4);
    tradeAdvisor.suggestedAsk(100).should.equal(140);
  });
  it('on 5th trade of period 2, .suggestedAsk(100) should be 140 (period 2 4th trade=150)', function(){
    tradeAdvisor.newTrade(100).newTrade(100).newTrade(100).newTrade(150);
    assert.ok(tradeAdvisor.tradeNumber===5);
    tradeAdvisor.pricesWithProbabilities(4,{sort:byPriceDescending}).should.deepEqual(
      [
        [150,0.5],
        [140,1]
      ]
    );
    tradeAdvisor.suggestedAsk(100).should.equal(140);
  });
  it('on 5th trade of period 2, .suggestedAsk(100) should be 125 (period 2 4th trade=125)', function(){
    tradeAdvisor.newTrade(100).newTrade(100).newTrade(100).newTrade(125);
    assert.ok(tradeAdvisor.tradeNumber===5);
    tradeAdvisor.pricesWithProbabilities(4,{sort:byPriceDescending}).should.deepEqual(
      [
        [140,0.5],
        [125,1]
      ]
    );
    tradeAdvisor.suggestedAsk(100).should.equal(125);
  });
});
