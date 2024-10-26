const axios = require('axios');
const WebSocket = require('ws');


const HTTP_SERVER_URL = 'http://localhost:3000/api/v1';
const WS_SERVER_URL = 'ws://localhost:8080';


describe('Trading System Tests', () => {
  let ws;

  beforeAll(async () => {
    ws = new WebSocket(WS_SERVER_URL);
    await new Promise((resolve) => {
      ws.on('open', () => {
        console.log('WebSocket connection established');
        resolve();
      });
    });
  });

  afterAll(() => {
    ws.close();
  });

  beforeEach(async () => {
    await axios.post(`${HTTP_SERVER_URL}/reset`);
  });

  const waitForWSMessage = () => {
    return new Promise((resolve) => {
      ws.once('message', (data) => {
        const parsedData = JSON.parse(data);
        console.log('Received WebSocket message:', parsedData);
        resolve(parsedData);
      });
    });
  };

  test('ResetTest ', async () => {
    const res = await axios.post(`${HTTP_SERVER_URL}/reset`)
    expect(res.status).toBe(200);
  });

  test('Create user, onramp INR, and check balance', async () => {
    const userId = 'testUser1';
    await axios.post(`${HTTP_SERVER_URL}/user/create/${userId}`);

    const onrampResponse = await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, {
      userId,
      amount: 1000000
    });

    expect(onrampResponse.status).toBe(200);

    const balanceResponse = await axios.get(`${HTTP_SERVER_URL}/balance/inr/${userId}`);
    expect(balanceResponse.data.data).toEqual({ balance: 1000000, locked: 0 });
  });

  test('Create symbol and check orderbook', async () => {
    const symbol = 'TEST_SYMBOL_30_Dec_2024';
    await axios.post(`${HTTP_SERVER_URL}/symbol/create/${symbol}`);

    const orderbookResponse = await axios.get(`${HTTP_SERVER_URL}/orderbook/${symbol}`);
    expect(orderbookResponse.data.data).toEqual({ yes: {}, no: {} });
  });

  test('Place buy order for yes stock and check WebSocket response', async () => {
    const userId = 'testUser2';
    const symbol = 'BTC_USDT_10_Oct_2024_9_30';
    await axios.post(`${HTTP_SERVER_URL}/user/create/${userId}`);
    await axios.post(`${HTTP_SERVER_URL}/symbol/create/${symbol}`);
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId, amount: 1000000 });

    await ws.send(JSON.stringify({ action: "subscribe", stockSymbol: "BTC_USDT_10_Oct_2024_9_30" }))

    const buyOrderResponse = axios.post(`${HTTP_SERVER_URL}/order/buy`, {
      userId,
      stockSymbol: symbol,
      quantity: 100,
      price: 850,
      stockType: 'yes'
    });

    const wsMessage = await waitForWSMessage();
    const data = await buyOrderResponse

    expect(data.status).toBe(200)

    expect(wsMessage.message["no"]['150']).toEqual({
      total: 100,
      orders: {
        [userId]: {
          "inverse": 100,
          "normal": 0
        }
      }
    });
  });


  test('Place sell order for no stock and check WebSocket response', async () => {
    const userId = 'testUser3';
    const symbol = 'ETH_USDT_15_Nov_2024_14_00';
    await axios.post(`${HTTP_SERVER_URL}/user/create/${userId}`);
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId, amount: 1000000 });
    await axios.post(`${HTTP_SERVER_URL}/symbol/create/${symbol}`);

    axios.post(`${HTTP_SERVER_URL}/trade/mint`, {
      userId,
      stockSymbol: symbol,
      quantity: 200
    });

    await ws.send(JSON.stringify({ action: "subscribe", stockSymbol: "ETH_USDT_15_Nov_2024_14_00" }))

    const sellOrderResponse = axios.post(`${HTTP_SERVER_URL}/order/sell`, {
      userId,
      stockSymbol: symbol,
      quantity: 100,
      price: 200,
      stockType: 'no'
    });

    const wsMessage = await waitForWSMessage();

    const data = await sellOrderResponse

    expect(data.status).toBe(200);
    expect(wsMessage.message.no['200']).toEqual({
      total: 100,
      orders: {
        [userId]: {
          "inverse": 0,
          "normal": 100
        }
      }
    });
  });

  test('Execute matching orders and check WebSocket response', async () => {
    const buyerId = 'buyer1';
    const sellerId = 'seller1';
    const symbol = 'AAPL_USDT_20_Jan_2025_10_00';
    const price = 950;
    const quantity = 50;

    await axios.post(`${HTTP_SERVER_URL}/user/create/${buyerId}`);
    await axios.post(`${HTTP_SERVER_URL}/user/create/${sellerId}`);
    await axios.post(`${HTTP_SERVER_URL}/symbol/create/${symbol}`);
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId: buyerId, amount: 1000000 });
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId: sellerId, amount: 1000000 });

    await axios.post(`${HTTP_SERVER_URL}/trade/mint`, {
      userId: sellerId,
      stockSymbol: symbol,
      quantity: 100
    });

    await ws.send(JSON.stringify({ action: "subscribe", stockSymbol: symbol }));

    axios.post(`${HTTP_SERVER_URL}/order/sell`, {
      userId: sellerId,
      stockSymbol: symbol,
      quantity,
      price,
      stockType: 'yes'
    });

    await waitForWSMessage()

    axios.post(`${HTTP_SERVER_URL}/order/buy`, {
      userId: buyerId,
      stockSymbol: symbol,
      quantity,
      price,
      stockType: 'yes'
    });

    const executionWsMessage = await waitForWSMessage();

    expect(executionWsMessage.yes?.[price]).toBeUndefined();
    const buyerStockBalance = axios.get(`${HTTP_SERVER_URL}/balance/stock/${buyerId}`);

    const sellerInrBalance = axios.get(`${HTTP_SERVER_URL}/balance/inr/${sellerId}`);
    const res_1 = await buyerStockBalance

    const res_2 = await sellerInrBalance
    console.log("HEre")
    console.log(res_1.data.data, res_2.data.data)

    expect(res_1.data.data[symbol].yes.quantity).toBe(quantity);
    expect(res_2.data.data.balance).toBe(price * quantity + 1000000 - (100000 * 2));
  });



  test('Execute minting opposite orders with higher quantity and check WebSocket response', async () => {
    const buyerId = 'buyer1';
    const buyer2Id = 'buyer2'
    const symbol = 'AAPL_USDT_20_Jan_2025_10_00';
    const price = 850;
    const quantity = 50;

    await axios.post(`${HTTP_SERVER_URL}/user/create/${buyerId}`);
    await axios.post(`${HTTP_SERVER_URL}/user/create/${buyer2Id}`);
    await axios.post(`${HTTP_SERVER_URL}/symbol/create/${symbol}`);
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId: buyerId, amount: 1000000 });
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId: buyer2Id, amount: 1000000 });

    await ws.send(JSON.stringify({ action: "subscribe", stockSymbol: symbol }));

    axios.post(`${HTTP_SERVER_URL}/order/buy`, {
      userId: buyerId,
      stockSymbol: symbol,
      quantity,
      price,
      stockType: 'yes'
    });

    await waitForWSMessage();
    axios.post(`${HTTP_SERVER_URL}/order/buy`, {
      userId: buyer2Id,
      stockSymbol: symbol,
      quantity: quantity + 10,
      price: 1000 - price,
      stockType: 'no'
    });


    const executionWsMessage = await waitForWSMessage();


    console.log("line 225", executionWsMessage)

    const message = executionWsMessage["message"]



    expect(message.no?.[(1000 - price)]).toBeUndefined();
    expect(message.yes?.[price]).toEqual({
      total: 10,
      orders: {
        [buyer2Id]: {
          "inverse": 10,
          "normal": 0
        }
      }
    })

  })



  test('Execute buying stocks from multiple users and check WebSocket response', async () => {
    const buyerId = 'buyer1';
    const buyer2Id = 'buyer2'
    const buyer3Id = 'buyer3'
    const symbol = 'AAPL_USDT_20_Jan_2025_10_00';
    const price = 850;
    const quantity = 50;

    await axios.post(`${HTTP_SERVER_URL}/user/create/${buyerId}`);
    await axios.post(`${HTTP_SERVER_URL}/user/create/${buyer2Id}`);
    await axios.post(`${HTTP_SERVER_URL}/user/create/${buyer3Id}`);
    await axios.post(`${HTTP_SERVER_URL}/symbol/create/${symbol}`);
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId: buyerId, amount: 1000000 });
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId: buyer2Id, amount: 1000000 });
    await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, { userId: buyer3Id, amount: 1000000 });

    await ws.send(JSON.stringify({ action: "subscribe", stockSymbol: symbol }));

    axios.post(`${HTTP_SERVER_URL}/order/buy`, {
      userId: buyerId,
      stockSymbol: symbol,
      quantity,
      price,
      stockType: 'yes'
    });

    await waitForWSMessage();

    axios.post(`${HTTP_SERVER_URL}/order/buy`, {
      userId: buyer2Id,
      stockSymbol: symbol,
      quantity: quantity + 20,
      price,
      stockType: 'yes'
    });

    await waitForWSMessage();

    axios.post(`${HTTP_SERVER_URL}/order/buy`, {
      userId: buyer3Id,
      stockSymbol: symbol,
      quantity: 2 * quantity + 30,
      price: 1000 - price,
      stockType: 'no'
    });

    // console.log((1000 - price) * (2 * quantity + 30))
    const executionWsMessage = await waitForWSMessage();

    const message = executionWsMessage.message

    expect(message.no?.[(1000 - price)]).toBeUndefined();
    expect(message.yes?.[price]).toEqual({
      total: 10,
      orders: {
        [buyer3Id]: {
          inverse: 10,
          normal: 0

        }
      }
    })

    const buyerStockBalance = await axios.get(`${HTTP_SERVER_URL}/balance/stock/${buyerId}`);
    const buyer2StockBalance = await axios.get(`${HTTP_SERVER_URL}/balance/stock/${buyer2Id}`);
    const buyer3StockBalance = await axios.get(`${HTTP_SERVER_URL}/balance/stock/${buyer3Id}`);

    expect(buyerStockBalance.data.data[symbol].yes.quantity).toBe(quantity);
    expect(buyer2StockBalance.data.data[symbol].yes.quantity).toBe(quantity + 20);
    expect(buyer3StockBalance.data.data[symbol].no.quantity).toBe(2 * quantity + 20);

    const buyerInrBalance = await axios.get(`${HTTP_SERVER_URL}/balance/inr/${buyerId}`);
    const buyer2InrBalance = await axios.get(`${HTTP_SERVER_URL}/balance/inr/${buyer2Id}`);
    const buyer3InrBalance = await axios.get(`${HTTP_SERVER_URL}/balance/inr/${buyer3Id}`);


    console.log(buyerInrBalance.data)
    console.log(buyer2InrBalance.data)
    console.log(buyer3InrBalance.data)



    expect(buyerInrBalance.data.data.balance).toBe(1000000 - (price * quantity));
    expect(buyer2InrBalance.data.data.balance).toBe(1000000 - (price * (quantity + 20)));
    expect(buyer3InrBalance.data.data.balance).toBe(1000000 - ((1000 - price) * (2 * quantity + 30)));

  })


});
