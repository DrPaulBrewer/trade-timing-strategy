# trade-timing-strategy
[![Build Status](https://travis-ci.org/DrPaulBrewer/trade-timing-strategy.svg?branch=master)](https://travis-ci.org/DrPaulBrewer/trade-timing-strategy)
[![Coverage Status](https://coveralls.io/repos/github/DrPaulBrewer/trade-timing-strategy/badge.svg?branch=master)](https://coveralls.io/github/DrPaulBrewer/trade-timing-strategy?branch=master)

A simple trade timing strategy for a repeated double auction market with consistent supply and demand in each period.  Uses backwards induction and stochastic optimization against a collated list of trades.

# Warning

This is in a pre-release state and additional documentation will be provided at a later time.

# Installation

```
npm i trade-timing-strategy -S
```

# Initialization

```
const {TradeTimingStrategy} = require('trade-timing-strategy');
const tts = new TradeTimingStrategy();
```

# Usage

```
// recording periods and single trades
tts.newPeriod();
tts.newTrade(150);
tts.newTrade(225);
tts.newTrade(200);
tts.newTrade(175);
tts.newPeriod();
// getting a suggested bid
const myBid = tts.suggestedBid(300,{currentBid:190,currentAsk:250,smooth:0.001});
// getting a suggested ask
const myAsk = tts.suggestedAsk(180,{currentBid:100,currentAsk:300,smooth:0.001});
```

# License: MIT

This software Copyright (c) 2020 Paul Brewer, Economic & Financial Technology Consulting LLC <drpaulbrewer@eaftc.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
