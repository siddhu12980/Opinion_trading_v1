package helper

import (
	typess "engine/types"
	"errors"
	"fmt"
	"math"
)

func ToggleStockType(stockType typess.OrderTypeYesNo) typess.OrderTypeYesNo {
	if stockType == typess.Yes {
		return typess.NO
	} else {
		return typess.Yes

	}
}

func HandleStockTransfer(
	buyer string,
	seller string,
	stockSymbol string,
	stockType typess.OrderTypeYesNo,
	quantity int32,
	price int32,
	isInverse bool,
) error {
	if quantity <= 0 {
		return errors.New("quantity must be positive")
	}
	if price <= 0 {
		return errors.New("price must be positive")
	}
	if buyer == seller {
		return errors.New("buyer and seller cannot be the same")
	}

	buyerStocks, exists := typess.STOCK_BALANCES[buyer]
	if !exists {
		buyerStocks = make(typess.UserStockBalances)
		typess.STOCK_BALANCES[buyer] = buyerStocks
	}

	if _, exists := buyerStocks[stockSymbol]; !exists {
		buyerStocks[stockSymbol] = struct {
			Yes *typess.Stock `json:"yes,omitempty"`
			No  *typess.Stock `json:"no,omitempty"`
		}{
			Yes: &typess.Stock{Quantity: 0, Locked: 0},
			No:  &typess.Stock{Quantity: 0, Locked: 0},
		}
	}

	sellerStocks, exists := typess.STOCK_BALANCES[seller]
	if !exists {
		sellerStocks = make(typess.UserStockBalances)
		typess.STOCK_BALANCES[seller] = sellerStocks
	}

	if _, exists := sellerStocks[stockSymbol]; !exists {
		sellerStocks[stockSymbol] = struct {
			Yes *typess.Stock `json:"yes,omitempty"`
			No  *typess.Stock `json:"no,omitempty"`
		}{
			Yes: &typess.Stock{Quantity: 0, Locked: 0},
			No:  &typess.Stock{Quantity: 0, Locked: 0},
		}
	}

	var buyerStock *typess.Stock
	if stockType == typess.Yes {
		buyerStock = buyerStocks[stockSymbol].Yes
	} else {
		buyerStock = buyerStocks[stockSymbol].No
	}

	effectiveStockType := stockType
	if isInverse {
		if effectiveStockType == typess.Yes {
			effectiveStockType = typess.NO
		} else {
			effectiveStockType = typess.Yes
		}
	}

	var sellerStock *typess.Stock
	if effectiveStockType == typess.Yes {
		sellerStock = sellerStocks[stockSymbol].Yes
	} else {
		sellerStock = sellerStocks[stockSymbol].No
	}

	if !isInverse {
		if sellerStock.Quantity < quantity {
			return fmt.Errorf("insufficient stock balance for seller: have %d, need %d",
				sellerStock.Quantity, quantity)
		}
	} else {
		totalCost := quantity * price
		buyerBalance, buyerExists := typess.INR_BALANCES[buyer]
		sellerBalance, sellerExists := typess.INR_BALANCES[seller]

		if !buyerExists || !sellerExists {
			return errors.New("buyer or seller INR balance not found")
		}

		if buyerBalance.Balance < totalCost {
			return fmt.Errorf("insufficient INR balance for buyer: have %d, need %d",
				buyerBalance.Balance, totalCost)
		}
		if sellerBalance.Balance < totalCost {
			return fmt.Errorf("insufficient INR balance for seller: have %d, need %d",
				sellerBalance.Balance, totalCost)
		}

		//................

	}

	if isInverse {
		totalCost := quantity * price

		buyerStock.Quantity += quantity
		sellerStock.Quantity += quantity

		buyerBalance := typess.INR_BALANCES[buyer]
		sellerBalance := typess.INR_BALANCES[seller]

		buyerBalance.Balance -= totalCost
		sellerBalance.Balance -= totalCost

		typess.INR_BALANCES[buyer] = buyerBalance
		typess.INR_BALANCES[seller] = sellerBalance
	} else {
		sellerStock.Quantity -= quantity
		buyerStock.Quantity += quantity
	}

	return nil
}

func UpdateUserBalance(userBalance typess.UserBalance, quantity int32, price int32) typess.UserBalance {
	amount := price * quantity
	return typess.UserBalance{
		Balance: userBalance.Balance - amount,
		Locked:  userBalance.Locked + amount,
	}
}

func MatchOrders(
	orderList map[string]typess.OrderTypes,
	quantity int32,
	buyer string,
	stockSymbol string,
	stockType typess.OrderTypeYesNo,
	price int32,
) (int32, error) {
	if quantity <= 0 {
		return 0, errors.New("quantity must be positive")
	}

	if _, found := typess.STOCK_BALANCES[buyer]; !found {
		return -1, fmt.Errorf("buyer %s not found in stock balances", buyer)
	}

	remainingQuantity := quantity

	for seller, availableQuantities := range orderList {
		if _, found := typess.STOCK_BALANCES[seller]; !found {
			return -1, fmt.Errorf("seller %s not found in stock balances", seller)
		}

		totalAvailable := int32(availableQuantities.Normal + availableQuantities.Inverse)
		if totalAvailable <= 0 {
			continue
		}

		quantityToTake := int32(math.Min(float64(remainingQuantity), float64(totalAvailable)))

		if err := ProcessNormalOrders(
			buyer,
			seller,
			stockSymbol,
			stockType,
			price,
			quantityToTake,
			&availableQuantities,
		); err != nil {
			return remainingQuantity, fmt.Errorf("error processing normal orders: %v", err)
		}

		if err := ProcessInverseOrders(
			buyer,
			seller,
			stockSymbol,
			stockType,
			price,
			quantityToTake,
			&availableQuantities,
		); err != nil {
			return remainingQuantity, fmt.Errorf("error processing inverse orders: %v", err)
		}

		if availableQuantities.Normal == 0 && availableQuantities.Inverse == 0 {
			delete(orderList, seller)
		} else {
			orderList[seller] = availableQuantities
		}

		remainingQuantity -= quantityToTake
		if remainingQuantity == 0 {
			break
		}
	}

	return remainingQuantity, nil
}

// for helper
// ----------------------------------------------------------------------------------
func ProcessNormalOrders(
	buyer string,
	seller string,
	stockSymbol string,
	stockType typess.OrderTypeYesNo,
	price int32,
	quantityToTake int32,
	availableQuantities *typess.OrderTypes,
) error {
	if quantityToTake <= int32(availableQuantities.Normal) {
		if err := HandleStockTransfer(buyer, seller, stockSymbol, stockType, quantityToTake, price, false); err != nil {
			return fmt.Errorf("failed to handle normal transfer: %v", err)
		}
		availableQuantities.Normal -= int(quantityToTake)
		return nil
	}

	if availableQuantities.Normal > 0 {
		if err := HandleStockTransfer(buyer, seller, stockSymbol, stockType, int32(availableQuantities.Normal), price, false); err != nil {
			return fmt.Errorf("failed to handle partial normal transfer: %v", err)
		}
		availableQuantities.Normal = 0
	}

	return nil
}

func ProcessInverseOrders(
	buyer string,
	seller string,
	stockSymbol string,
	stockType typess.OrderTypeYesNo,
	price int32,
	quantityToTake int32,
	availableQuantities *typess.OrderTypes,
) error {
	remainingAfterNormal := quantityToTake - int32(availableQuantities.Normal)

	if remainingAfterNormal > 0 && availableQuantities.Inverse > 0 {
		inverseQuantity := int32(math.Min(float64(remainingAfterNormal), float64(availableQuantities.Inverse)))

		if err := HandleStockTransfer(buyer, seller, stockSymbol, stockType, inverseQuantity, price, true); err != nil {
			return fmt.Errorf("failed to handle inverse transfer: %v", err)
		}

		availableQuantities.Inverse -= int(inverseQuantity)
	}

	return nil
}

//------------------------------------------------------------------------------------

// for main COntroller
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
func CreateNewInverseOrder(
	op typess.OrderBookOperation,
	yesOrders typess.Outcome,
	userBalance *typess.UserBalance,
) (*typess.ProcessResult, error) {
	if _, found := yesOrders[op.InvPriceStr]; !found {
		yesOrders[op.InvPriceStr] = &typess.Order{
			Total:  int(op.Quantity),
			Orders: make(map[string]typess.OrderTypes),
		}
	}

	orderList := yesOrders[op.InvPriceStr].Orders
	if order, exists := orderList[op.UserID]; exists {
		order.Inverse += int(op.Quantity)
		orderList[op.UserID] = order
	} else {
		orderList[op.UserID] = typess.OrderTypes{Inverse: int(op.Quantity)}
	}
	newBalance := UpdateUserBalance(*userBalance, op.Quantity, op.Price)
	*userBalance = newBalance

	return &typess.ProcessResult{
		Note:         "TXN Complete Inverted",
		RemainingQty: 0,
	}, nil
}

func ProcessExistingOrders(
	op typess.OrderBookOperation,
	existingOrders *typess.Order,
	noOrders typess.Outcome,
	yesOrders typess.Outcome,
	userBalance *typess.UserBalance,
) (*typess.ProcessResult, error) {
	remainingQty, err := MatchOrders(
		existingOrders.Orders,
		op.Quantity,
		op.UserID,
		op.StockSymbol,
		typess.NO,
		op.Price,
	)
	if err != nil {
		return nil, fmt.Errorf("order matching failed: %v", err)
	}

	matchedQty := op.Quantity - remainingQty
	existingOrders.Total -= int(matchedQty)

	if existingOrders.Total == 0 {
		delete(noOrders, op.PriceStr)
	}

	if remainingQty > 0 {
		if err := HandleRemainingQuantity(op, remainingQty, yesOrders, userBalance); err != nil {
			return nil, err
		}
		return &typess.ProcessResult{
			Note:         "TXN Complete Partial Inverted",
			RemainingQty: remainingQty,
		}, nil
	}

	return &typess.ProcessResult{
		Note:         "TXN Complete",
		RemainingQty: 0,
	}, nil
}

func InitializeOrderBook(stockSymbol string) error {
	if _, found := typess.ORDER_BOOK[stockSymbol]; !found {
		typess.ORDER_BOOK[stockSymbol] = typess.OrderBookEntry{
			Yes: make(typess.Outcome),
			No:  make(typess.Outcome),
		}
	}
	return nil
}

func HandleRemainingQuantity(
	op typess.OrderBookOperation,
	remainingQty int32,
	yesOrders typess.Outcome,
	userBalance *typess.UserBalance,
) error {
	if _, found := yesOrders[op.InvPriceStr]; !found {
		yesOrders[op.InvPriceStr] = &typess.Order{
			Total:  0,
			Orders: make(map[string]typess.OrderTypes),
		}
	}

	orderList := yesOrders[op.InvPriceStr].Orders
	if order, exists := orderList[op.UserID]; exists {
		order.Inverse += int(remainingQty)
		orderList[op.UserID] = order
	} else {
		orderList[op.UserID] = typess.OrderTypes{Inverse: int(remainingQty)}
	}

	yesOrders[op.InvPriceStr].Total += int(remainingQty)

	userBalance.Balance -= remainingQty * op.Price
	userBalance.Locked += remainingQty * op.Price

	return nil
}

// +++++++++++++++++++++++++++++++++++++++++
