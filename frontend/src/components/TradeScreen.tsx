import { useRecoilValue } from "recoil";
import NavbarUser from "./NavbarUser";
import OrderBook from "./OrderBook";
// import PlaceOrder from "./PlaceOrder";
import Tradeheader from "./Tradeheader";
import { userState } from "../Store/atom";
import { useEffect, useState } from "react";
import { WS_SERVER_URL } from "../constants/const";
import { useParams } from "react-router-dom";
import axios from "axios";
import PlaceOrder from "./PlaceOrder";

interface StockData {
  price: number;
  quantity: number;
}

interface WsData {
  yes?: StockData[];
  no?: StockData[];
}

interface OrderData {
  total: number;
  orders: {
    [buyer: string]: {
      normal: number;
      inverse: number;
    };
  };
}

interface InputData {
  yes: { [price: string]: OrderData };
  no: { [price: string]: OrderData };
}

function transform(data: InputData): WsData {
  const wsData: WsData = {
    yes: [],
    no: [],
  };

  if (!data) {
    return wsData;
  }

  if (Object.keys(data.yes).length > 0) {
    Object.entries(data.yes).forEach(([price, orderData]) => {
      wsData.yes!.push({
        price: parseInt(price),
        quantity: orderData.total,
      });
    });
  }

  if (Object.keys(data.no).length > 0) {
    Object.entries(data.no).forEach(([price, orderData]) => {
      wsData.no!.push({
        price: parseInt(price),
        quantity: orderData.total,
      });
    });
  }

  return wsData;
}

const TradeScreen = () => {
  const user = useRecoilValue(userState);
  const [title, setTitle] = useState<string>("");
  const parms = useParams();

  const [ans_data, set_data] = useState<WsData | null>(null);
  const tradeSymbol = parms.id;

  if (!user.userId) {
    return <span>Not logged in</span>;
  }

  if (!tradeSymbol) {
    return <span>Invalid trade Symbol</span>;
  }

  async function checkTradeSymbol() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/symbol/get/${tradeSymbol}`
      );

      if (!response.data.data) {
        throw new Error("No data");
      }

      return response.data.data;
    } catch (error) {
      console.log("Error:", error);
    }
  }

  useEffect(() => {
    checkTradeSymbol()
      .then((data) => {
        console.log("Data:", data);
        setTitle(data.Market);
        if (data) {
          console.log("Starting WebSocket connection");
          const conn = new WebSocket(WS_SERVER_URL);

          conn.onopen = () => {
            console.log("WebSocket connected");
            const data = JSON.stringify({
              stockSymbol: tradeSymbol,
              action: "subscribe",
            });
            conn.send(data);
          };

          conn.onmessage = (message) => {
            const res = JSON.parse(message.data);
            console.log(res.message);
            const ws_transformed = transform(res.message);
            console.log("ans:", ws_transformed);
            set_data(ws_transformed);
          };

          return () => {
            console.log("Closing WebSocket connection");
            conn.close();
          };
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [tradeSymbol]);

  return (
    <>
      <NavbarUser balance={user.balance.freeBalances || 0} />
      <div className="flex flex-col  pt-5 ">
        <div>
          <Tradeheader tile={title} />
        </div>
        <div className="w-full mx-auto flex gap-10">
          <div className="w-[67%]">
            {" "}
            <OrderBook wsData={ans_data} />
          </div>
          <div className="w-[30%]">
            <PlaceOrder stockSymbol={tradeSymbol} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeScreen;
