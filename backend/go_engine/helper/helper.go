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

		fmt.Print(" \n Stock Balance doesnot exist for buyer in Handle Stock Transfer ", typess.STOCK_BALANCES[buyer])
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
	} else if stockType == typess.NO {
		buyerStock = buyerStocks[stockSymbol].No
	} else {
		return errors.New("yes No not matched inside HandleStock Transfer ")
	}

	//check stock type if yes then take buyer yes and seller yes
	//if inverse then add yes buyer but also add no to seller

	effectiveStockType := stockType
	if isInverse {
		if effectiveStockType == typess.Yes {
			effectiveStockType = typess.NO
		} else {
			effectiveStockType = typess.Yes
		}
	}

	// toogling stock type , inverse ho vane take opposite of seller
	var sellerStock *typess.Stock
	if effectiveStockType == typess.Yes {
		sellerStock = sellerStocks[stockSymbol].Yes
	} else {
		sellerStock = sellerStocks[stockSymbol].No
	}

	if isInverse {
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

		// Update balances and stocks
		buyerBalance.Balance -= totalCost
		sellerBalance.Locked -= (1000 - price) * quantity

		buyerStock.Quantity += quantity
		sellerStock.Quantity += quantity

		typess.INR_BALANCES[buyer] = buyerBalance
		typess.INR_BALANCES[seller] = sellerBalance

		fmt.Printf("\n ss Buyer Balance %v  %v \n Seller Balance %v \n", buyerBalance, typess.INR_BALANCES[buyer], sellerBalance)

		fmt.Printf(" \n ss Buyer stock %v \n Seller stock %v \n", buyerStock, sellerStock)

	} else {

		sellerStock.Locked -= quantity
		buyerStock.Quantity += quantity

		buyerBalance := typess.INR_BALANCES[buyer]
		sellerBalance := typess.INR_BALANCES[seller]

		totalCost := quantity * price
		buyerBalance.Balance -= totalCost
		sellerBalance.Balance += totalCost

		typess.INR_BALANCES[buyer] = buyerBalance
		typess.INR_BALANCES[seller] = sellerBalance

		fmt.Printf(" \n Buyer Balance %v , %v \n Seller Balance %v \n", buyerBalance, typess.INR_BALANCES[buyer], sellerBalance)

		fmt.Printf("\n Buyer stock %v \n Seller stock %v \n", buyerStock, sellerStock)

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
	//need to use pointer
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

	remainingQuantity := quantity // i want total this : remaningQuantity

	for seller, availableQuantities := range orderList {
		if _, found := typess.STOCK_BALANCES[seller]; !found {
			return -1, fmt.Errorf("seller %s not found in stock balances", seller)
		}

		totalAvailable := int32(availableQuantities.Normal + availableQuantities.Inverse)
		if totalAvailable <= 0 {
			continue
		}

		quantityToTake := int32(math.Min(float64(remainingQuantity), float64(totalAvailable)))

		fmt.Printf(" \n Quantity %v %v %v  ", quantityToTake, availableQuantities.Normal, availableQuantities.Inverse)
		if quantityToTake <= int32(availableQuantities.Normal) && (int32(availableQuantities.Normal) != 0) {
			if err := HandleStockTransfer(buyer, seller, stockSymbol, stockType, quantityToTake, price, false); err != nil {
				return -1, fmt.Errorf("failed to handle normal transfer: %v", err)
			}
			availableQuantities.Normal -= int(quantityToTake)
			fmt.Printf("Available Quantitis after normal transfer %v", availableQuantities.Normal)
		} else {
			remainingAfterNormal := quantityToTake - int32(availableQuantities.Normal)

			fmt.Printf("data %v %v %v %v %v %v ", buyer, seller, stockSymbol, stockType, availableQuantities.Normal, price)
			if availableQuantities.Normal != 0 {
				if err := HandleStockTransfer(buyer, seller, stockSymbol, stockType, int32(availableQuantities.Normal), price, false); err != nil {
					return -1, fmt.Errorf("failed to handle partial normal transfer: %v", err)
				}
			}

			if remainingAfterNormal != 0 {
				if err := HandleStockTransfer(buyer, seller, stockSymbol, stockType, remainingAfterNormal, price, true); err != nil {
					return -1, fmt.Errorf("failed to handle inverse transfer: %v", err)
				}
			}

			availableQuantities.Normal = 0
			availableQuantities.Inverse -= int(remainingAfterNormal)

			// orderList[seller] = availableQuantities

		}

		if availableQuantities.Normal == 0 && availableQuantities.Inverse == 0 {
			fmt.Printf("Deleteing  %v order  \n ", availableQuantities)
			delete(orderList, seller)
		} else {
			fmt.Printf("Reassigining order list : %v \n ", orderList[seller])
			orderList[seller] = availableQuantities

		}
		remainingQuantity -= quantityToTake
		if remainingQuantity == 0 {
			break
		}
	}

	fmt.Printf(" \n Match Order OrderList return sttment  : %v  %v\n", orderList, remainingQuantity)

	return remainingQuantity, nil
}

//------------------------------------------------------------------------------------

// for main COntroller
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
func CreateNewInverseOrder(
	op typess.OrderBookOperation,
	yesOrders *typess.Outcome,
	userBalance *typess.UserBalance,
) (*typess.ProcessResult, error) {

	data, found := (*yesOrders)[op.InvPriceStr]
	if !found {
		data = &typess.Order{
			Total:  0,
			Orders: make(map[string]typess.OrderTypes),
		}
		(*yesOrders)[op.InvPriceStr] = data
	}

	orderList := data.Orders
	if order, exists := orderList[op.UserID]; exists {
		order.Inverse += int(op.Quantity)
		orderList[op.UserID] = order
	} else {
		orderList[op.UserID] = typess.OrderTypes{Normal: 0, Inverse: int(op.Quantity)}
	}

	data.Total += int(op.Quantity)

	newBalance := UpdateUserBalance(*userBalance, op.Quantity, op.Price)
	*userBalance = newBalance

	return &typess.ProcessResult{
		Note:         "TXN Complete Inverted",
		RemainingQty: 0,
	}, nil
}

func ProcessExistingOrdersYes(
	op typess.OrderBookOperation,
	existingOrders *typess.Order,
	noOrders *typess.Outcome,
	yesOrders *typess.Outcome,
	userBalance *typess.UserBalance,
) (*typess.ProcessResult, error) {

	// existing_orders := ConvertOrderList(existingOrders.Orders)

	remainingQty, err := MatchOrders(
		existingOrders.Orders,
		op.Quantity,
		op.UserID,
		op.StockSymbol,
		typess.Yes, //change Types Dynamically
		op.Price,
	)

	if err != nil {
		return nil, fmt.Errorf("order matching failed: %v", err)
	}

	fmt.Printf("Processing Existing Order: wanted %v, remaining after match %v, now inverting %v\n", op.Quantity, remainingQty, existingOrders.Total)

	matchedQty := op.Quantity - remainingQty

	existingOrders.Total -= int(matchedQty)

	fmt.Printf("Remaining balance in order book: %v\n", existingOrders)

	if existingOrders.Total == 0 {
		delete(*yesOrders, op.PriceStr) //change this dynamic
	}

	if remainingQty > 0 {
		if _, found := (*noOrders)[op.InvPriceStr]; !found {
			(*noOrders)[op.InvPriceStr] = &typess.Order{ //this need to be dynaic
				Total:  0,
				Orders: make(map[string]typess.OrderTypes),
			}
		}

		orderList := (*noOrders)[op.InvPriceStr].Orders
		if order, exists := orderList[op.UserID]; exists {
			order.Inverse += int(remainingQty)
			orderList[op.UserID] = order
		} else {
			orderList[op.UserID] = typess.OrderTypes{Normal: 0, Inverse: int(remainingQty)}
		}
		(*noOrders)[op.InvPriceStr].Total += int(remainingQty)

		userBalance.Balance -= remainingQty * op.Price
		userBalance.Locked += remainingQty * op.Price

		typess.INR_BALANCES[op.UserID] = *userBalance

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

func ProcessExistingOrdersNO(
	op typess.OrderBookOperation,
	existingOrders *typess.Order,
	noOrders *typess.Outcome,
	yesOrders *typess.Outcome,
	userBalance *typess.UserBalance,
) (*typess.ProcessResult, error) {

	// fmt.Println("Inside Processing No")
	// fmt.Printf("OrderBookOperation: %+v\n", op)
	// fmt.Printf("Existing Orders: %+v\n", existingOrders)
	// fmt.Printf("Initial User Balance: %+v\n", userBalance)

	remainingQty, err := MatchOrders(
		existingOrders.Orders,
		op.Quantity,
		op.UserID,
		op.StockSymbol,
		typess.NO, //change Types Dynamically
		op.Price,
	)

	// fmt.Println("\nAfter MatchOrders call")
	// fmt.Printf("Remaining Quantity after match: %v\n", remainingQty)
	if err != nil {
		// fmt.Printf("Error in MatchOrders: %v\n", err)
		return nil, fmt.Errorf("order matching failed: %v", err)
	}

	matchedQty := op.Quantity - remainingQty
	// fmt.Printf("Matched Quantity: %v\n", matchedQty)
	// fmt.Printf("Existing Orders Total before deduction: %v\n", existingOrders.Total)

	existingOrders.Total -= int(matchedQty)
	// fmt.Printf("Existing Orders Total after deduction: %v\n", existingOrders.Total)

	if existingOrders.Total == 0 {
		// fmt.Printf("Removing noOrders entry for price %v\n", op.PriceStr)
		delete(*noOrders, op.PriceStr)
	}

	// Check if we have remaining quantity to invert
	if remainingQty > 0 {
		// fmt.Printf("Remaining Quantity is greater than 0, proceeding with inversion\n")

		// Check for existing entry in yesOrders
		if _, found := (*yesOrders)[op.InvPriceStr]; !found {
			// fmt.Printf("No existing entry in yesOrders for InvPriceStr %v. Creating new entry.\n", op.InvPriceStr)
			(*yesOrders)[op.InvPriceStr] = &typess.Order{
				Total:  0,
				Orders: make(map[string]typess.OrderTypes),
			}
		} else {
			// fmt.Printf("Found existing entry in yesOrders for InvPriceStr %v\n", op.InvPriceStr)
		}

		orderList := (*yesOrders)[op.InvPriceStr].Orders
		if order, exists := orderList[op.UserID]; exists {
			// fmt.Printf("Existing order found for UserID %v in orderList. Current Inverse: %v\n", op.UserID, order.Inverse)
			order.Inverse += int(remainingQty)
			orderList[op.UserID] = order
			// fmt.Printf("Updated Inverse Quantity for UserID %v: %v\n", op.UserID, order.Inverse)
		} else {
			// fmt.Printf("No existing order for UserID %v. Creating new order with Inverse Quantity: %v\n", op.UserID, remainingQty)
			orderList[op.UserID] = typess.OrderTypes{Normal: 0, Inverse: int(remainingQty)}
		}
		(*yesOrders)[op.InvPriceStr].Total += int(remainingQty)
		// fmt.Printf("Updated yesOrders Total for InvPriceStr %v: %v\n", op.InvPriceStr, (*yesOrders)[op.InvPriceStr].Total)

		// Update user balance for remainingQty
		// fmt.Printf("User Balance before update: %+v %v\n", *userBalance, typess.INR_BALANCES[op.UserID])

		user := typess.INR_BALANCES[op.UserID]

		user.Balance -= remainingQty * op.Price
		user.Locked += remainingQty * op.Price

		*userBalance = user

		// fmt.Printf("User Balance after update: %+v\n", *userBalance)

		// Update global INR_BALANCES
		typess.INR_BALANCES[op.UserID] = *userBalance
		// fmt.Printf("Updated INR_BALANCES for UserID %v: %+v\n", op.UserID, typess.INR_BALANCES[op.UserID])

		return &typess.ProcessResult{
			Note:         "TXN Complete Partial Inverted",
			RemainingQty: remainingQty,
		}, nil
	}

	// fmt.Println("No remaining quantity; Transaction Complete")

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
