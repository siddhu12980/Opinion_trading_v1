const TableHeader = ({ title }: { title: string }) => (
    <div>
      <h2 className="font-medium">{title}</h2>
      <div className="w-full h-px bg-slate-500/20"></div>
    </div>
  );
  
  const OrderSection = ({
    type,
    orders,
  }: {
    type: "YES" | "NO";
    orders: Array<{ price: number; quantity: number }>;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <TableHeader title="PRICE" />
        <TableHeader title={`QTY AT ${type}`} />
      </div>
      <div className="relative">
        {orders.map((order, index) => (
          <div key={index} className="grid grid-cols-2 gap-30 py-1">
            <div className="text-slate-900">{order.price}</div>
            <div className="relative w-16">
              {" "}
              <div
                className={`absolute inset-0 ${
                  type === "YES" ? "bg-blue-400" : "bg-red-400"
                } opacity-20`}
                style={{
                  width: `${Math.min(
                    (order.quantity /
                      Math.max(...orders.map((o) => o.quantity))) *
                      200,
                    100
                  )}%`,
                }}
              />
              <span className="relative z-10">{order.quantity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  

  interface StockData {
    price: number;
    quantity: number;
  }
  
  interface WsData {
    yes?: StockData[];
    no?: StockData[];
  }

  type AnsData = WsData | null

  const OrderBook = ({wsData}: {wsData:AnsData}) => {

 
    const yesOrders_const = [
      { price: 6.5, quantity: 50 },
      { price: 7, quantity: 977 },
      { price: 8, quantity: 54 },
      { price: 8.5, quantity: 1 },
      { price: 9, quantity: 3 },
    ];
  
    const noOrders_const = [
      { price: 4, quantity: 1 },
      { price: 4.5, quantity: 5 },
      { price: 5.5, quantity: 1 },
      { price: 6, quantity: 3 },
      { price: 6.5, quantity: 8 },
    ];

    const yesOrders = wsData ? wsData.yes : yesOrders_const

    const noOrders = wsData ? wsData.no : noOrders_const

  
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl h-96 relative top-24">
        <div className="flex items-center gap-3 p-3">
          <h1 className="text-xl font-serif">Order Book</h1>
          <span className="text-slate-500">Activity</span>
        </div>
        <section className="grid grid-cols-2 gap-5 p-4">
          <OrderSection type="YES" orders={yesOrders} />
          <OrderSection type="NO" orders={noOrders} />
        </section>
      </div>
    );
  };
  
  export default OrderBook;