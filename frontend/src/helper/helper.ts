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