let webSocket = new WebSocket('wss://stream.binance.com:9443/ws/bnbusdt@trade');

let coinSymbol = document.getElementById('coinSymbol');

let coinPriceElement = document.getElementById('coinPrice');

let portofolio = document.getElementById('portofolio');

let quantity = null;


let lastPrice = null;

let ptf = null;

let placeOrder = null;

let orderStatus = false;

let symbol = null;



webSocket.onmessage = (event) => {
    let coinObject = JSON.parse(event.data);

    symbol = coinObject.s;
    coinSymbol.innerText = symbol;
    coinSymbol.style.color = 'white'

    let price = parseFloat(coinObject.p);
    coinPriceElement.innerText = price;
    coinPriceElement.style.color = !lastPrice || lastPrice === price ? 'white' : price > lastPrice ? 'green' : 'red';
    lastPrice = price;
    
    ptf = quantity*lastPrice;
    portofolio.innerHTML = 'WALLET : ' + ptf;

    if(orderStatus == true) {
        let percentage = ((lastPrice - placeOrder)/placeOrder)*100;
        document.getElementById("percentage").innerHTML = 'PNL ' + percentage.toFixed(4) + '%';
    } else {
        
    }
}

function buyFunction() {
    quantity = parseFloat(document.getElementById('quantity').value);
    placeOrder = lastPrice;
    
    if (placeOrder == lastPrice ) {
        document.getElementById("demo").innerHTML = 'anda berhasil membeli ' + quantity + ' ' + symbol +' di harga ' + placeOrder;
        orderStatus = true;
    } else {
        document.getElementById("demo").innerHTML = 'Pembelian Gagal';
    }
    
  }







