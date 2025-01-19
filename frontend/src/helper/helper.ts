export const calculateTotal = (price: string, quantity: string): string => {
    const priceNum = Number(price);
    const quantityNum = Number(quantity);
    return isNaN(priceNum) || isNaN(quantityNum)
        ? "0.0"
        : (priceNum * quantityNum).toFixed(1);
};

export const validateBuy = (price: string, balance: number, quantity: string): boolean => {
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
        return false;
    }

    if (priceNum >= 10) {
        return false
    }

    const total = Number(calculateTotal(price, quantity));
    return !(total === 0 || total > balance);
};


export const validateSell = (
  quantity: string,
  stockQuantity: number,
): boolean => {
  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum <= 0) {
    return false;
  }

  return quantityNum <= stockQuantity;
};



export type OrderBookInput = {
  orderBook: {
    yes: {
      [price: string]: {
        total: number;
        orders: {
          [userId: string]: {
            normal: number;
            inverse: number;
          };
        };
      };
    };
    no: {
      [price: string]: {
        total: number;
        orders: {
          [userId: string]: {
            normal: number;
            inverse: number;
          };
        };
      };
    };
  };
  stockSymbol: string;
  title: string;
};

export type ProcessedOrder = {
  stockSymbol: string;
  title: string;
  type: "yes" | "no";
  price: number;
  quantity: number;
};

export const processOrderBooks = (
  data: OrderBookInput[],
  userId: string
): ProcessedOrder[] => {
  const result: ProcessedOrder[] = [];

  data.forEach(({ orderBook, stockSymbol, title }) => {
    // Process "yes" orders
    Object.entries(orderBook.yes).forEach(([price, details]) => {
      const userOrders = details.orders[userId];
      if (userOrders) {
        if (userOrders.normal > 0) {
          result.push({
            stockSymbol,
            title,
            type: "yes",
            price: parseInt(price), // Parse price from string to number
            quantity: userOrders.normal,
          });
        }
        if (userOrders.inverse > 0) {
          result.push({
            stockSymbol,
            title,
            type: "no",
            price: 1000 - parseInt(price), // Adjust price for inverse
            quantity: userOrders.inverse,
          });
        }
      }
    });

    // Process "no" orders
    Object.entries(orderBook.no).forEach(([price, details]) => {
      const userOrders = details.orders[userId];
      if (userOrders) {
        if (userOrders.normal > 0) {
          result.push({
            stockSymbol,
            title,
            type: "no",
            price: parseInt(price), // Parse price from string to number
            quantity: userOrders.normal,
          });
        }
        if (userOrders.inverse > 0) {
          result.push({
            stockSymbol,
            title,
            type: "yes",
            price: 1000 - parseInt(price), // Adjust price for inverse
            quantity: userOrders.inverse,
          });
        }
      }
    });
  });

  return result;
};