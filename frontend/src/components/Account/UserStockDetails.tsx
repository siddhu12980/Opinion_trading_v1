import React from "react";
import { TrendingUp, TrendingDown, Lock as LockIcon } from "lucide-react";

interface StockData {
  [key: string]: {
    yes: {
      quantity: number;
      locked: number;
    };
    no: {
      quantity: number;
      locked: number;
    };
  };
}

interface UserStockDetailsProps {
  stockData: StockData;
}

const StockCard: React.FC<{
  stockCode: string;
  stockInfo: StockData[string];
}> = ({ stockCode, stockInfo }) => {
  const totalYesStocks = stockInfo.yes.quantity;
  const totalNoStocks = stockInfo.no.quantity;
  const totalYesLocked = stockInfo.yes.locked;
  const totalNoLocked = stockInfo.no.locked;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-md">
      <div className="p-4 flex justify-between items-center bg-gray-100/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold uppercase">
              {stockCode.slice(0, 3)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{stockCode}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-200">
        <div className="p-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <TrendingUp className="text-green-500" size={20} />
            <span className="font-medium text-green-700">YES</span>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">
              {totalYesStocks}
            </span>
            {totalYesLocked > 0 && (
              <div className="flex items-center text-yellow-600">
                <LockIcon size={16} className="mr-1" />
                <span className="text-sm">{totalYesLocked}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <TrendingDown className="text-red-500" size={20} />
            <span className="font-medium text-red-700">NO</span>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <span className="text-2xl font-bold text-red-600">
              {totalNoStocks}
            </span>
            {totalNoLocked > 0 && (
              <div className="flex items-center text-yellow-600">
                <LockIcon size={16} className="mr-1" />
                <span className="text-sm">{totalNoLocked}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserStockDetails: React.FC<UserStockDetailsProps> = ({ stockData }) => {
  if (!stockData || Object.keys(stockData).length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4   ">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Stock Portfolio</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Yes Stocks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">No Stocks</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <h3 className="text-lg font-semibold text-gray-800">No Stocks</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Stock Portfolio</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stockData).map(([stockCode, stockInfo]) => (
          <StockCard
            key={stockCode}
            stockCode={stockCode}
            stockInfo={stockInfo}
          />
        ))}
      </div>
    </div>
  );
};

export default UserStockDetails;
