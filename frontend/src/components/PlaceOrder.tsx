import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { HTTP_SERVER_URL } from "../constants/const";
import {
  userBalanceSelector,
  userState,
  userStockSelector,
} from "../Store/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { useQueryClient } from "react-query";
import { OrderType, TradeType } from "../Types/types";
import { calculateTotal, validateBuy, validateSell } from "../helper/helper";
import { ActionButton, NumberInput } from "../helper/Helper_comp";

const PlaceOrder = ({ stockSymbol }: { stockSymbol: string }) => {
  const queryClient = useQueryClient();
  const user = useRecoilValue(userState);
  const [freeBalances, setFreeBalance] = useRecoilState(userBalanceSelector);
  const userStocks = useRecoilValue(userStockSelector);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [price, setPrice] = useState<string>("7.0");
  const [quantity, setQuantity] = useState<string>("1.0");
  const [selectedType, setSelectedType] = useState<OrderType>("Yes");
  const [tradeType, setTradeType] = useState<TradeType>("Buy");

  const validateOrder = () => {
    const stockSymbol = "btc";

    let currentStockQuantity;

    if (userStocks[stockSymbol]) {
      if (selectedType == "No") {
        currentStockQuantity = userStocks[stockSymbol].no?.quantity ?? 0;
      } else {
        currentStockQuantity = userStocks[stockSymbol].yes?.quantity ?? 0;
      }
    } else {
      currentStockQuantity = 0;
    }

    if (tradeType === "Buy") {
      const isValid = validateBuy(price, freeBalances || 0, quantity);
      setError(!isValid);
      setErrorMessage(isValid ? "" : "Insufficient balance");
      return isValid;
    } else {
      const isValid = validateSell(quantity, currentStockQuantity);
      setError(!isValid);
      setErrorMessage(isValid ? "" : "Insufficient stock quantity");
      return isValid;
    }
  };

  const handlePriceChange = (newPrice: string) => {
    setPrice(newPrice);
    validateOrder();
  };

  const handleQuantityChange = (newQuantity: string) => {
    setQuantity(newQuantity);
    validateOrder();
  };

  const handleOrder = async () => {
    if (!error) {
      if (tradeType == "Buy") {
        console.log({
          tradeType,
          type: selectedType,
          price,
          quantity,
          total: calculateTotal(price, quantity),
        });

        console.log(quantity, parseFloat(price), selectedType.toLowerCase());

        try {
          const response = await axios.post(`${HTTP_SERVER_URL}/order/buy`, {
            userId: user.userId,
            stockSymbol: stockSymbol,
            quantity: parseInt(quantity),
            price: parseFloat(price) * 100,
            stockType: selectedType.toLocaleLowerCase(),
          });

          console.log("Order response:", response.data);

          if (!response.data["data"]) {
            setError(true);
            setErrorMessage(response.data["message"]);
          }

          if (response.data.data.orderBook) {
            await queryClient.invalidateQueries({ queryKey: ["userBalance"] });
            const newBalanceResponse = await axios.get(
              `${HTTP_SERVER_URL}/balance/inr/${user.userId}`
            );
            setFreeBalance(newBalanceResponse.data.data.balance / 100);
          }
        } catch (error) {
          console.error("Order error:", error);
        }
      }

      if (tradeType == "Sell") {
        console.log(tradeType, quantity, freeBalances, price, selectedType);
      }
    }
  };

  const handleTypeChange = (type: OrderType, defaultPrice: string) => {
    setSelectedType(type);
    setPrice(defaultPrice);
  };

  const handleTradeTypeChange = (type: TradeType) => {
    setTradeType(type);
  };

  useEffect(() => {
    validateOrder();
  }, [tradeType, selectedType, price, quantity, freeBalances, userStocks]);

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl relative top-24 p-6 space-y-6 max-w-lg mx-auto">
        <div className="flex gap-3 p-1 bg-slate-50 rounded-full">
          <ActionButton
            type="Buy"
            isActive={tradeType === "Buy"}
            onClick={() => handleTradeTypeChange("Buy")}
            variant="trade"
          />
          <ActionButton
            type="Sell"
            isActive={tradeType === "Sell"}
            onClick={() => handleTradeTypeChange("Sell")}
            variant="trade"
          />
        </div>

        <div className="flex gap-3 p-1 bg-slate-50 rounded-full">
          <ActionButton
            type="Yes"
            price={price}
            isActive={selectedType === "Yes"}
            onClick={() => handleTypeChange("Yes", "7.0")}
          />
          <ActionButton
            type="No"
            price={price}
            isActive={selectedType === "No"}
            onClick={() => handleTypeChange("No", "3.0")}
          />
        </div>

        <div className="space-y-6">
          <NumberInput
            label="Price"
            value={price}
            onChange={handlePriceChange}
            subtitle="977 qty available"
            step={0.5}
            min={0.5}
            max={9.5}
          />
          <NumberInput
            label="Quantity"
            value={quantity}
            onChange={handleQuantityChange}
            step={1}
            min={1}
            max={100}
          />
        </div>

        <div className="flex justify-between px-4 py-2">
          <div className="text-center">
            <p className="text-xl font-medium">
              ₹{calculateTotal(price, quantity)}
            </p>
            <p className="text-slate-500">You {tradeType.toLowerCase()}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-medium text-green-600">
              ₹{calculateTotal("10", quantity)}
            </p>
            <p className="text-slate-500">You get</p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 text-slate-500">
          Advanced Options
          <ChevronDown size={20} />
        </button>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <p className="font-medium">{errorMessage}</p>
              <button className="text-slate-500 underline">Learn more</button>
            </div>
          </div>
        )}

        <button
          onClick={handleOrder}
          disabled={error}
          className={`w-full py-4 rounded-xl font-medium text-slate-500 
            ${error ? "bg-slate-200" : "bg-blue-200"}`}
        >
          Place {tradeType} order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
