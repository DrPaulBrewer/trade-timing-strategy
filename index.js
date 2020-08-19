
function byPriceAscending(a,b){
  return a[0]-b[0];
}

function byPriceDescending(a,b){
  return b[0]-a[0];
}

function weight(data,p){
  let w=0;
  try {
    w = data.find((d)=>(d[0]===p))[1];
  } catch(e){
    w = 0;
  }
  return w;
}


function optimize({v,c,choices}){
  function profit(p){
    if (v!==undefined){
      return v-p;
    }
    if (c!==undefined){
      return p-c;
    }
    throw new Error("optimize: must define either v or c");
  }
  const trivial = { price: (v||c), expectedProfit: 0};
  if ((choices.length===0) || (profit(choices[0][0])<=0)){
    return trivial;
  }
  const result = (
   choices
   .filter(([p])=>(((v!==undefined)&&(v>p))||((c!==undefined)&&(c<p))))
   .reduce(
    (acc,cv)=>{
      const [p,prob] = cv;
      const eProfit = prob*profit(p);
      if (eProfit>=acc.expectedProfit){
        // favors replacement of acc by cv on equality
        // because prob is higher due to ordering of choices
        return {
          price: p,
          expectedProfit: eProfit
        };
      }
      return acc;
    },
    trivial
  )
 );
  return result;
}


class TradeTimingStrategy {
  constructor(){
    this.tradeCollator = [null];
    this.periodNumber = 0;
    this.tradeNumber = 1;
    this.counters = [0];
  }

  newPeriod(){
    this.periodNumber += 1;
    this.tradeNumber = 1;
    return this;
  }

  newTrade(p){
    if ((typeof(p)!=='number') || (p<0))
      throw new RangeError("newTrade(p), p must be a non-negative number");
    if (this.periodNumber===0)
      throw new Error("must call newPeriod() before recording trades with newTrade()");
    if (this.counters[this.tradeNumber]===undefined)
      this.counters[this.tradeNumber] = 0;
    this.counters[this.tradeNumber] += 1;
    if (this.tradeCollator[this.tradeNumber]===undefined){
      this.tradeCollator[this.tradeNumber] = new Map();
    }
    const collator = this.tradeCollator[this.tradeNumber];
    const count = collator.get(p);
    if (count){
      collator.set(p, count+1);
    } else {
      collator.set(p,1);
    }
    this.tradeNumber += 1;
    return this;
  }

  pricesWithProbabilities(n, {t, above, below, sort, smooth}={}){
    const offset = (n<this.tradeNumber)? 0 : -1;
    const periods = this.periodNumber+offset;
    let data = [...(this.tradeCollator[n] || [])];
    let atAbove=0,atBelow=0;
    // T
    if (typeof(above)==='number'){
      atAbove = weight(data,above);
      data = data.filter((d)=>(d[0]>above));
    }
    if (typeof(below)==='number'){
      atBelow = weight(data,below);
      data = data.filter((d)=>(d[0]<below));
    }
    if (smooth){
      const first = (isFinite(above))? (above+1): (data[0][0]);
      const last = (isFinite(below))? (below-1): (data[data.length-1][0]);
      const tempMap = new Map(data);
      for(let p=first;p<=last;p++){
        const found = tempMap.get(p);
        if (found)
          tempMap.set(p,found+smooth);
        else
          tempMap.set(p,smooth);
      }
      data = [...tempMap];
    }
    if (data.length===0) return [];
    data.sort(sort);
    let divisor;
    if (isFinite(above)||isFinite(below)){
      divisor = atAbove+atBelow+data.reduce(
        (acc,cv)=>(acc+cv[1]),
        0
      );
      if (smooth)
        divisor += smooth*2;
    } else {
      divisor = (t)? this.counters[t]: periods;
      if (smooth)
        divisor += smooth*data.length;
    }
    const result = [[data[0][0],data[0][1]/divisor]];
    for(let j=1,l=data.length;j<l;++j){
      const cv = data[j];
      result[j] = [
          cv[0],
          (cv[1]/divisor)+result[j-1][1]
      ];
    }
    return result;
  }

  suggestedBid(unitValue, {currentBid,currentAsk,smooth}={}){
    if ((typeof(unitValue)!=='number') || (unitValue<0))
      throw new RangeError("suggestedBid(unitValue), unitValue must be a non-negative number");
    const acceptAskProfit = (currentAsk && (currentAsk<unitValue))? (unitValue-currentAsk): 0;
    let tradeIndex = this.tradeCollator.length-1;
    const noDataOK = (currentBid>0) && (currentAsk>0) && (smooth>0);
    const noData = (tradeIndex<1) || (this.tradeCollator[1].size===0);
    if (noData && !noDataOK)
      return undefined;
    const tradeNumber = (this.tradeNumber>tradeIndex)? tradeIndex: this.tradeNumber;
    let futureTradeExpectedProfit = 0, stage = null;
    while(tradeIndex>=tradeNumber){
      // apply smoothing and filtering only to current trade, future trades use unsmoothed data
      const options = (tradeIndex===tradeNumber)?({
          above: currentBid,
          below: currentAsk,
          smooth
      }):({t:tradeNumber});
      stage = optimize({
        v: unitValue-futureTradeExpectedProfit,
        choices: this.pricesWithProbabilities(tradeIndex, {...options, sort: byPriceAscending})
      });
      if (stage.expectedProfit>0) futureTradeExpectedProfit += stage.expectedProfit;
      tradeIndex -= 1;
    }
    const shouldAcceptAsk = (acceptAskProfit && (Math.floor(acceptAskProfit)>=Math.floor(futureTradeExpectedProfit)));
    if (shouldAcceptAsk)
      return currentAsk;
    return (stage.price>=unitValue)? undefined: stage.price;
  }

  suggestedAsk(unitCost, {currentBid,currentAsk,smooth}={}){
    if ((typeof(unitCost)!=='number') || (unitCost<0))
      throw new RangeError("suggestedAsk{unitCost}, unitCost must be a non-negative number");
    const acceptBidProfit = (currentBid && (currentBid>unitCost))? (currentBid-unitCost): 0;
    let tradeIndex = this.tradeCollator.length-1;
    const noDataOK = (currentBid>0) && (currentAsk>0) && (smooth>0);
    const noData = (tradeIndex<1) || (this.tradeCollator[1].size===0);
    if (noData && !noDataOK)
      return undefined;
    const tradeNumber = (this.tradeNumber>tradeIndex)? tradeIndex: this.tradeNumber;
    let futureTradeExpectedProfit = 0, stage = null;
    while(tradeIndex>=tradeNumber){
      // apply smoothing and filtering only to current trade, future trades use unsmoothed data
      const options = (tradeIndex===tradeNumber)?({
          above: currentBid,
          below: currentAsk,
          smooth
      }):({t:tradeNumber});
      stage = optimize({
        c: unitCost+futureTradeExpectedProfit,
        choices: this.pricesWithProbabilities(tradeIndex, {...options, sort:byPriceDescending})
      });
      if (stage.expectedProfit>0) futureTradeExpectedProfit += stage.expectedProfit;
      tradeIndex -= 1;
    }
    const shouldAcceptBid = (acceptBidProfit && (Math.floor(acceptBidProfit)>=Math.floor(futureTradeExpectedProfit)));
    if (shouldAcceptBid)
      return currentBid;
    return (stage.price<=unitCost)? undefined: stage.price;
  }

}

module.exports={ byPriceAscending, byPriceDescending, weight, optimize, TradeTimingStrategy};
