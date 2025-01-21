import React from "react";
import { ProcessedOrder } from "../../helper/helper";
type TransactionsListProps = {
  orders: ProcessedOrder[];
};

const Txn: React.FC<TransactionsListProps> = ({ orders }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount / 100);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 border-b-4  ">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-600">Yes Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">No Orders</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <h3 className="text-lg font-semibold text-gray-800">No Orders</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 border-b-4  ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-gray-600">Yes Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">No Orders</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 overflow-scroll   lg:h-96 no-scrollbar ">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-transform hover:translate-y-[-2px]"
          >
            <div className="p-4">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    order.type === "yes" ? "bg-emerald-100" : "bg-red-100"
                  } mr-4`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-6 h-6 ${
                      order.type === "yes" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    <path
                      fill="currentColor"
                      d={
                        // order.type === "yes"
                        //   ? "M7 14l5-5 5 5H7z" // Up arrow for buy
                        //   : "M7 10l5 5 5-5H7z" // Down arrow for sell

                        order.buy
                          ? "M7 14l5-5 5 5H7z" // Up arrow for buy
                          : "M7 10l5 5 5-5H7z" // Down arrow for sell
                      }
                    />
                  </svg>
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {/* limit the title to 10 chars if not do elliplse */}
                      {order.stockSymbol.length > 10
                        ? order.stockSymbol.substring(0, 10) + "..."
                        : order.stockSymbol}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      {order.stockSymbol}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {new Date().toLocaleDateString()} •{" "}
                    {/* {order.type === "yes" ? "Buy" : "Sell"} Order */}
                    {order.buy ? "Buy" : "Sell"} Order
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">
                    {formatCurrency(order.price * order.quantity)}
                  </p>
                  <div className="mt-1 text-sm text-gray-500">
                    {order.quantity} shares @ {formatCurrency(order.price)}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`h-1 ${
                order.type === "yes" ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Txn;
