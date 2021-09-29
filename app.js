let webSocket = new WebSocket('wss://fstream.binance.com/ws/btcusdt@trade');

let coinSymbol = document.getElementById('coinSymbol');

let coinPriceElement = document.getElementById('coinPrice');

let portofolio = document.getElementById('porto');

let quantity = null;

let lastPrice = null;

let ptf = null;

let buyOrder = null;

let sellOrder = null;

let orderStatus = false;

let buyStatus = false;

let sellStatus = false;

let symbol = null;

let volume = 0.0;



webSocket.onmessage = (event) => {
    let coinObject = JSON.parse(event.data);

    symbol = coinObject.s;
    coinSymbol.innerText = symbol;
    coinSymbol.style.color = 'white'

    let price = parseFloat(coinObject.p);
    // coinPriceElement.innerText = price;
    coinPriceElement.style.color = !lastPrice || lastPrice === price ? 'white' : price > lastPrice ? 'green' : 'red';
    
    lastPrice = price;

    let q = parseFloat(coinObject.q);
    volume += q;
    document.getElementById('volume').innerText = 'Vol : ' + volume;
    
    ptf = quantity*lastPrice;
    portofolio.innerHTML = 'WALLET : $' + ptf;

    if(orderStatus == true) {
        if(buyStatus == true && sellStatus == false) {
            let percentage = 0;
            if(quantity == 0) {
                document.getElementById("percentage").innerHTML = '';
                document.getElementById("demo").innerHTML = '';
            } else {
                let profitBuy = (lastPrice - buyOrder ) * quantity;
                document.getElementById("profit").innerHTML = 'profit : $' + profitBuy;
                document.getElementById("demo").innerHTML = 'anda berhasil buy long ' + quantity + ' ' + symbol +' di harga ' + buyOrder;
                percentage = ((lastPrice-buyOrder)/buyOrder)*100;
                document.getElementById("percentage").innerHTML = 'PNL ' + percentage.toFixed(4) + '%';
            }
        } else if (sellStatus == true && buyStatus == false) {
            let percentage = 0;
            if(quantity == 0) {
                document.getElementById("percentage").innerHTML = '';
                document.getElementById("demo").innerHTML = '';
            } else {
                let profitSell = (buyOrder - lastPrice ) * quantity;
                document.getElementById("profit").innerHTML = 'profit : $' + profitSell;
                document.getElementById("demo").innerHTML = 'anda berhasil short sell ' + quantity + ' ' + symbol +' di harga ' + sellOrder;
                percentage = ((sellOrder-lastPrice)/lastPrice)*100;
                document.getElementById("percentage").innerHTML = 'PNL ' + percentage.toFixed(4) + '%';
            }
        }    
    } else {
        
    }
}

function buyFunction() {
    quantity = parseFloat(document.getElementById('quantity').value);
    buyOrder = lastPrice;
    
    if (buyOrder == lastPrice ) {
        
        orderStatus = true;
        buyStatus = true;
        sellStatus = false;
    } else {
        document.getElementById("demo").innerHTML = 'Pembelian Gagal';
    } 
}

function sellFunction() {
    quantity = parseFloat(document.getElementById('quantity').value);
    sellOrder = lastPrice;
    
    if (sellOrder == lastPrice ) {
        document.getElementById("demo").innerHTML = 'anda berhasil membeli ' + quantity + ' ' + symbol +' di harga ' + sellOrder;
        orderStatus = true;
        sellStatus = true;
        buyStatus = false
    } else {
        document.getElementById("demo").innerHTML = 'Pembelian Gagal';
    }  
}

//chart
const log = console.log;

const chartProperties = {
  width:500,
  height:200,
  timeScale:{
    timeVisible:true,
    secondsVisible:false,
  }
}

const domElement = document.getElementById('tvchart');
const chart = LightweightCharts.createChart(domElement,chartProperties);
const candleSeries = chart.addCandlestickSeries();

// // https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000

 fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1m&limit=1000`)
   .then(res => res.json())
   .then(data => {
     const cdata = data.map(d => {
       return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
     });
     candleSeries.setData(cdata);
   })
   .catch(err => log(err))

let fWebSocket = new WebSocket('wss://fstream.binance.com/ws/btcusdt@kline_1m');

fWebSocket.onmessage = (event) => {
  let coinObject = JSON.parse(event.data);
  let fprice = parseFloat(coinObject.k.c);
  coinPriceElement.innerText = fprice;

  let pl = {
    time: [coinObject.k.t]/1000,
    open: parseFloat(coinObject.k.o),
    high: parseFloat(coinObject.k.h),
    low: parseFloat(coinObject.k.l),
    close: parseFloat(coinObject.k.c),
  }
  // console.log(pl);
  candleSeries.update(pl);
}







