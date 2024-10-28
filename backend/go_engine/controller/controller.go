package controller

import (
	"context"
	"encoding/json"
	"engine/helper"
	typess "engine/types"
	"fmt"
	"math"
	"strconv"

	"github.com/redis/go-redis/v9"
)

func Publish(stockSymbol string) {
	opt, redis_err := redis.ParseURL("redis://localhost:6379")
	if redis_err != nil {
		fmt.Printf("Error parsing Redis URL: %v\n", redis_err)
		return
	}

	fmt.Printf("Publishing to stock %s\n", stockSymbol)
	client := redis.NewClient(opt)
	ctx := context.Background()

	data := typess.ORDER_BOOK[stockSymbol]

	jsonData, _ := json.Marshal(data)
	jsonString := string(jsonData)

	if err := client.Publish(ctx, stockSymbol, jsonString).Err(); err != nil {
		fmt.Printf("Failed to publish to Redis: %v\n", err)
	}
}

func CreateJSONResponse(message string, data interface{}) (string, error) {
	response := map[string]interface{}{"message": message}
	if data != nil {
		response["data"] = data
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}
	return string(jsonResponse), nil
}

func GetINRBalance(userId string) (string, error) {
	if foundUser, exists := typess.INR_BALANCES[userId]; !exists {
		return CreateJSONResponse("User Not Found", nil)
	} else {
		return CreateJSONResponse("Success", foundUser)
	}

}

func GetStockBalance(userId string) (string, error) {
	if stockBalance, exists := typess.STOCK_BALANCES[userId]; !exists {
		return CreateJSONResponse("USer NOT FOund", nil)
	} else {
		return CreateJSONResponse("Success", stockBalance)
	}
}

func GetAllINRBalance() (string, error) {
	found := typess.INR_BALANCES

	if found == nil {
		return CreateJSONResponse("INR BOOK NOt FOund", nil)
	} else {
		return CreateJSONResponse("Success", found)
	}

}

func GetAllStockBalance() (string, error) {

	found := typess.STOCK_BALANCES

	if found == nil {
		return CreateJSONResponse("STOCK BOOK NOt FOund", nil)
	} else {
		return CreateJSONResponse("Success", found)
	}

}

func CreateSymbol(stockSymbol string) (string, error) {
	if val, exists := typess.ORDER_BOOK[stockSymbol]; !exists {
		create := typess.OrderBookEntry{
			Yes: typess.Outcome{},
			No:  typess.Outcome{},
		}

		// Add the new entry to the OrderBook
		typess.ORDER_BOOK[stockSymbol] = create

		return CreateJSONResponse("StockSymbol Created", create)
	} else {
		return CreateJSONResponse("Stock Symbol Exists", val)
	}
}

func GetOrderbook(stockSymbol string) (string, error) {
	if val, exists := typess.ORDER_BOOK[stockSymbol]; !exists {

		return CreateJSONResponse("StockSymbol Not available", nil)
	} else {
		return CreateJSONResponse("Order Book Fetched", val)
	}
}

func GetAllOrderbook() (string, error) {
	if val := typess.ORDER_BOOK; val == nil {
		return CreateJSONResponse("ORderBOok Not Available", nil)
	} else {
		return CreateJSONResponse("OrderBook", val)

	}

}

func MintStock(userId string, stockSymbol string, quantity int32, price int32) (string, error) {

	if quantity <= 0 {
		return CreateJSONResponse("Invalid quantity", nil)
	}
	if price <= 0 || price > 1000 {
		return CreateJSONResponse("Invalid price", nil)
	}

	if user_balance, found := typess.INR_BALANCES[userId]; !found {
		return CreateJSONResponse("User Not Found", nil)
	} else {

		if user_balance.Balance < (price * quantity) {
			return CreateJSONResponse("Insufficient Balance", nil)

		}

		if _, found := typess.STOCK_BALANCES[userId]; !found {
			typess.STOCK_BALANCES[userId] = map[string]struct {
				Yes *typess.Stock `json:"yes,omitempty"`
				No  *typess.Stock `json:"no,omitempty"`
			}{}

		}

		user_stock := typess.STOCK_BALANCES[userId]
		if stock, found := user_stock[stockSymbol]; !found {

			user_stock[stockSymbol] = struct {
				Yes *typess.Stock `json:"yes,omitempty"`
				No  *typess.Stock `json:"no,omitempty"`
			}{
				Yes: &typess.Stock{
					Quantity: quantity,
					Locked:   0,
				},
				No: &typess.Stock{
					Quantity: quantity,
					Locked:   0,
				},
			}
		} else {

			if stock.Yes != nil {
				stock.Yes.Quantity += quantity
			} else {
				stock.Yes = &typess.Stock{
					Quantity: quantity,
					Locked:   0,
				}
			}

			if stock.No != nil {
				stock.No.Quantity += quantity
			} else {
				stock.No = &typess.Stock{
					Quantity: quantity,
					Locked:   0,
				}
			}
		}

		if _, found := typess.ORDER_BOOK[stockSymbol]; !found {
			typess.ORDER_BOOK[stockSymbol] = typess.OrderBookEntry{
				Yes: nil,
				No:  nil,
			}
		}

		userBalance := typess.INR_BALANCES[userId]
		userBalance.Balance -= (price * 2 * quantity)
		typess.INR_BALANCES[userId] = userBalance

		data := map[string]interface{}{
			"Stock": typess.STOCK_BALANCES[userId],
			"INR":   typess.INR_BALANCES[userId],
			"Order": typess.ORDER_BOOK[stockSymbol],
		}

		return CreateJSONResponse("Stock Minted", data)
	}
}

func Onramp(userId string, amount int32) (string, error) {
	fmt.Print(typess.INR_BALANCES)
	if user, found := typess.INR_BALANCES[userId]; !found {
		return CreateJSONResponse("USer NOt Found", nil)
	} else {
		user.Balance += amount

		typess.INR_BALANCES[userId] = user

		message := fmt.Sprintf("Onramped %v with amout %v", userId, amount/100)

		return CreateJSONResponse(message, typess.INR_BALANCES[userId])
	}

}

func Reset() (string, error) {
	typess.INR_BALANCES = make(map[string]typess.UserBalance)
	typess.STOCK_BALANCES = make(map[string]typess.UserStockBalances)
	typess.ORDER_BOOK = make(map[string]typess.OrderBookEntry)

	data := map[string]interface{}{
		"Stock": typess.STOCK_BALANCES,
		"INR":   typess.INR_BALANCES,
		"Order": typess.ORDER_BOOK,
	}

	return CreateJSONResponse("Reset Success", data)

}

func CreateUser(userId string) (string, error) {

	if _, found := typess.INR_BALANCES[userId]; !found {

		newUser := typess.UserBalance{
			Balance: 0,
			Locked:  0,
		}

		if typess.INR_BALANCES == nil {
			typess.INR_BALANCES = make(map[string]typess.UserBalance)
		}

		typess.INR_BALANCES[userId] = newUser

		if typess.STOCK_BALANCES == nil {
			typess.STOCK_BALANCES = make(map[string]typess.UserStockBalances)
		}

		typess.STOCK_BALANCES[userId] = make(typess.UserStockBalances)

		data := map[string]interface{}{
			"Stock": typess.STOCK_BALANCES[userId],
			"INR":   typess.INR_BALANCES[userId],
		}

		fmt.Print(typess.INR_BALANCES)

		return CreateJSONResponse("User Created", data)
	} else {
		return CreateJSONResponse("User Already Exists", nil)
	}
}

func SellOrder(userId string, stockSymbol string, quantity int32, price int32, stockT typess.OrderTypeYesNo) (string, error) {
	fmt.Printf("SellOrder called - User: %s, StockSymbol: %s, Quantity: %d, Price: %d, StockType: %v\n", userId, stockSymbol, quantity, price, stockT)

	remainingQty := quantity

	stockType := typess.OrderTypeYesNo(stockT)

	if quantity <= 0 {
		fmt.Println("Invalid quantity provided")
		return CreateJSONResponse("Invalid quantity", nil)
	}
	if price <= 0 || price >= 1000 {
		fmt.Println("Invalid price provided")
		return CreateJSONResponse("Invalid price", nil)
	}

	userStockBalance, found := typess.STOCK_BALANCES[userId]
	if !found {
		fmt.Printf("User not found: %s\n", userId)
		return CreateJSONResponse("User Not Found", nil)
	}

	userStock, found := userStockBalance[stockSymbol]
	if !found {
		fmt.Printf("User %s doesn't own stock: %s\n", userId, stockSymbol)
		return CreateJSONResponse("User doesn't own the corresponding Stock", nil)
	}

	var stockBalance *typess.Stock
	var outcome typess.Outcome
	var oppOutcome typess.Outcome

	if stockType == typess.Yes {
		if userStock.Yes == nil {
			fmt.Printf("User %s doesn't own any Yes-type stock\n", userId)
			return CreateJSONResponse("User doesn't own any Yes-type stock", nil)
		}
		stockBalance = userStock.Yes
	} else if stockType == typess.NO {
		if userStock.No == nil {
			fmt.Printf("User %s doesn't own any No-type stock\n", userId)
			return CreateJSONResponse("User doesn't own any No-type stock", nil)
		}
		stockBalance = userStock.No
	} else {
		fmt.Println("Failed during type check")
		return CreateJSONResponse("Failed during type check", nil)
	}

	if stockBalance.Quantity < quantity {
		fmt.Printf("Insufficient Stock Quantity - User: %s, Available: %d, Required: %d\n", userId, stockBalance.Quantity, quantity)
		return CreateJSONResponse("Insufficient Stock Quantity", nil)
	}

	orderBook, found := typess.ORDER_BOOK[stockSymbol]
	if !found {
		fmt.Printf("Order book for %s not found, creating a new entry\n", stockSymbol)

		typess.ORDER_BOOK[stockSymbol] = typess.OrderBookEntry{
			Yes: make(typess.Outcome),
			No:  make(typess.Outcome),
		}
		orderBook = typess.ORDER_BOOK[stockSymbol]
	}

	if stockType == typess.Yes {
		if orderBook.Yes == nil {
			orderBook.Yes = make(typess.Outcome)
		}
		outcome = orderBook.Yes
		oppOutcome = orderBook.No
	} else {
		if orderBook.No == nil {
			orderBook.No = make(typess.Outcome)
		}
		outcome = orderBook.No
		oppOutcome = orderBook.Yes
	}

	priceStr := strconv.FormatInt(int64(price), 10)
	fmt.Printf("Processing order matching with oppOutcome. PriceStr:1000 - %s %v  %v %v\n ", (priceStr), oppOutcome, outcome, stockType)

	for keys, data := range oppOutcome {

		fmt.Printf(" \n key :%v data: %v \n", keys, data)
		check_price, err := strconv.Atoi(keys)
		if err != nil {
			fmt.Printf("Error parsing price in oppOutcome: %v\n", err)
			panic(err)
		}

		fmt.Printf("\n  checkgin price for matching price in opposite %v %v , %v \n \n", check_price, price, check_price+int(price))

		if (check_price + int(price)) <= 1000 {
			fmt.Printf("Found matching price. Check Price: %d, Current Price: %d\n", check_price, price)

			for seller1, availableQuantities := range data.Orders {
				fmt.Printf("Checking seller %s, Available Normal Quantity: %d\n", seller1, availableQuantities.Normal)

				if _, found := typess.STOCK_BALANCES[seller1]; !found {
					return "", fmt.Errorf("seller1 %s not found in stock balances", seller1)
				}

				totalAvailable := int32(availableQuantities.Normal)

				if totalAvailable <= 0 || availableQuantities.Normal <= 0 {
					fmt.Print("Continue USed ")
					continue
				}

				quantityToTake := int32(math.Min(float64(remainingQty), float64(totalAvailable)))
				fmt.Printf("Processing transfer. Quantity to take: %d\n", quantityToTake)

				fmt.Printf(" IT is working correctly q > 0 %v %v \n", availableQuantities.Normal, availableQuantities.Normal > 0)
				if int32(availableQuantities.Normal) > 0 {
					inversePrice, err := strconv.Atoi(keys)
					if err != nil {
						fmt.Printf("Failed to convert price str to int before transfer: %v\n", err)
						return "", fmt.Errorf("failed to handle price conv: %v", err)
					}

					if err := helper.HandleSellTransfer(userId, seller1, stockSymbol, stockType, quantityToTake, price, int32(inversePrice)); err != nil {
						fmt.Printf("Failed to handle normal transfer: %v\n", err)
						return "", fmt.Errorf("failed to handle normal transfer: %v", err)
					}

					availableQuantities.Normal -= int(quantityToTake)
					fmt.Printf("Updated available quantities after transfer - Normal: %d\n", availableQuantities.Normal)

					data.Orders[seller1] = availableQuantities

					fmt.Printf("Subtracting Start after matching %v quantity taken : %v", data, quantityToTake)
					data.Total -= int(quantityToTake)
					fmt.Printf("Subtracting Done after matching %v", data)

					remainingQty -= quantityToTake

				}

				if availableQuantities.Inverse == 0 && availableQuantities.Normal == 0 {

					delete(data.Orders, seller1)
					fmt.Printf("Deleted seller %s from orders\n", seller1)

					fmt.Printf(" \n Order List total : %v  %v\n", data, data.Orders)

					if data.Total == 0 {
						delete(oppOutcome, keys)
						fmt.Printf("Deleted key %s from oppOutcome\n", keys)
					}
				} else {
					fmt.Printf(" \n Updated remaining quantity after transaction - Remaining: %d total Remaning:%d \n", quantity, data.Total)
				}

				if remainingQty == 0 {
					fmt.Println("Order fully matched and fulfilled doing Break")
					break
				}
			}

		}
	}

	if remainingQty > 0 {
		fmt.Printf(" After Loop ,Quantity remaining, adding order to outcome. Remaining Quantity: %d\n", remainingQty)
		if _, found := outcome[priceStr]; !found {
			outcome[priceStr] = &typess.Order{
				Total:  0,
				Orders: make(map[string]typess.OrderTypes),
			}
		}

		order := outcome[priceStr]
		if _, found := order.Orders[userId]; !found {
			order.Orders[userId] = typess.OrderTypes{
				Normal:  int(remainingQty),
				Inverse: 0,
			}
		} else {
			orderTypes := order.Orders[userId]
			orderTypes.Normal += int(remainingQty)
			order.Orders[userId] = orderTypes
		}
		order.Total += int(remainingQty)

		stockBalance.Quantity -= remainingQty
		stockBalance.Locked += remainingQty
		fmt.Printf("After Loop, Order added to order book. Total: %d, Locked: %d\n", order.Total, stockBalance.Locked)
	} else {
		fmt.Println("After Loop Quantity is Zero, order fully matched and removed")
	}

	data := map[string]interface{}{
		"StockBalance": typess.STOCK_BALANCES[userId],
		"OrderBook":    typess.ORDER_BOOK[stockSymbol],
		"Balance":      typess.INR_BALANCES[userId],
	}
	go Publish(stockSymbol)
	fmt.Println("Sell order placed successfully and published")

	return CreateJSONResponse("Sell Order Placed", data)
}

// func SellOrder(userId string, stockSymbol string, quant int32, price int32, stockT typess.OrderTypeYesNo) (string, error) {

// 	//need to implement matching and minting logic first lest do minting logic
// 	//TODO minting

// 	quantity := quant //dynamic quantity y

// 	stockType := typess.OrderTypeYesNo(stockT)

// 	if quantity <= 0 {
// 		return CreateJSONResponse("Invalid quantity", nil)
// 	}
// 	if price <= 0 || price >= 1000 {
// 		return CreateJSONResponse("Invalid price", nil)
// 	}

// 	userStockBalance, found := typess.STOCK_BALANCES[userId]
// 	if !found {
// 		return CreateJSONResponse("User Not Found", nil)
// 	}

// 	userStock, found := userStockBalance[stockSymbol]

// 	if !found {
// 		return CreateJSONResponse("User doesn't own the corresponding Stock", nil)
// 	}

// 	var stockBalance *typess.Stock

// 	var outcome typess.Outcome // price : total + orders

// 	var oppOutcome typess.Outcome

// 	if stockType == typess.Yes {
// 		if userStock.Yes == nil {
// 			return CreateJSONResponse("User doesn't own any Yes-type stock", nil)
// 		}
// 		stockBalance = userStock.Yes
// 	} else if stockType == typess.NO {
// 		if userStock.No == nil {
// 			return CreateJSONResponse("User doesn't own any No-type stock", nil)
// 		}
// 		stockBalance = userStock.No
// 	} else {
// 		return CreateJSONResponse("Failed during type check", nil)
// 	}

// 	if stockBalance.Quantity < quantity {
// 		return CreateJSONResponse("Insufficient Stock Quantity", nil)
// 	}

// 	orderBook, found := typess.ORDER_BOOK[stockSymbol]
// 	if !found {
// 		typess.ORDER_BOOK[stockSymbol] = typess.OrderBookEntry{
// 			Yes: make(typess.Outcome),
// 			No:  make(typess.Outcome),
// 		}
// 		orderBook = typess.ORDER_BOOK[stockSymbol]
// 	}

// 	if stockType == typess.Yes {
// 		if orderBook.Yes == nil {
// 			orderBook.Yes = make(typess.Outcome)
// 		}
// 		outcome = orderBook.Yes
// 		oppOutcome = orderBook.No
// 	} else {
// 		if orderBook.No == nil {
// 			orderBook.No = make(typess.Outcome)
// 		}
// 		outcome = orderBook.No
// 		oppOutcome = orderBook.Yes
// 	}

// 	priceStr := strconv.FormatInt(int64(price), 10)

// 	for keys, data := range oppOutcome {

// 		check_price, err := strconv.Atoi(keys)
// 		if err != nil {
// 			panic(err)
// 		}

// 		if (check_price + int(price)) <= 10 {
// 			//do imting
// 			//handle stock tranfers

// 			remainingQuantity := quantity

// 			for seller1, availableQuantities := range data.Orders {

// 				if _, found := typess.STOCK_BALANCES[seller1]; !found {
// 					return "", fmt.Errorf("seller1 %s not found in stock balances", seller1)
// 				}

// 				totalAvailable := int32(availableQuantities.Normal)

// 				if totalAvailable <= 0 {
// 					continue
// 				}

// 				quantityToTake := int32(math.Min(float64(remainingQuantity), float64(totalAvailable)))

// 				fmt.Printf(" \n Quantity %v %v  ", quantityToTake, availableQuantities.Normal)

// 				if int32(availableQuantities.Normal) > 0 {

// 					if err := helper.HandleSellTransfer(userId, seller1, stockSymbol, stockType, quantityToTake, price); err != nil {

// 						return "", fmt.Errorf("failed to handle normal transfer: %v", err)
// 					}
// 					availableQuantities.Normal -= int(quantityToTake)

// 					fmt.Printf("Available Quantitis after seller transfer %v", availableQuantities.Normal)

// 					remainingAfterNormal := quantityToTake - int32(availableQuantities.Normal)

// 					availableQuantities.Normal = int(remainingAfterNormal)

// 					data.Orders[seller1] = availableQuantities

// 				}

// 				if availableQuantities.Inverse == 0 && availableQuantities.Normal == 0 {
// 					quantity = 0
// 					delete(data.Orders, seller1)

// 					if data.Total == 0 {
// 						delete(oppOutcome, keys)
// 					}

// 				} else {
// 					quantity -= quantityToTake
// 					data.Total -= int(quantityToTake)
// 				}

// 				remainingQuantity -= quantityToTake

// 				if remainingQuantity == 0 {
// 					quantity = 0
// 					break
// 				}
// 			}

// 		}
// 		//check if it zero

// 	}

// 	if quantity > 0 {

// 		if _, found := outcome[priceStr]; !found {
// 			outcome[priceStr] = &typess.Order{
// 				Total:  0,
// 				Orders: make(map[string]typess.OrderTypes),
// 			}
// 		}

// 		order := outcome[priceStr]

// 		if _, found := order.Orders[userId]; !found {
// 			order.Orders[userId] = typess.OrderTypes{
// 				Normal:  int(quantity),
// 				Inverse: 0,
// 			}
// 		} else {

// 			orderTypes := order.Orders[userId]
// 			orderTypes.Normal += int(quantity)
// 			order.Orders[userId] = orderTypes

// 		}
// 		order.Total += int(quantity)

// 		stockBalance.Quantity -= quantity
// 		stockBalance.Locked += quantity
// 	} else {
// 		fmt.Print("Quantity is Zero")
// 	}

// 	data := map[string]interface{}{
// 		"StockBalance": typess.STOCK_BALANCES[userId],
// 		"OrderBook":    typess.ORDER_BOOK[stockSymbol],
// 		"Balance":      typess.INR_BALANCES[userId],
// 	}

// 	go Publish(stockSymbol)

// 	return CreateJSONResponse("Sell Order Placed", data)
// }

func BuyNoOrder(userID string, stockSymbol string, quantity int32, price int32) (string, error) {

	if quantity <= 0 {
		return CreateJSONResponse("Invalid quantity", nil)
	}
	if price <= 0 || price >= 1000 {
		return CreateJSONResponse("Invalid price", nil)
	}

	op := typess.OrderBookOperation{
		UserID:      userID,
		StockSymbol: stockSymbol,
		Quantity:    quantity,
		Price:       price,
		InvPrice:    1000 - price,
		PriceStr:    strconv.FormatInt(int64(price), 10),
		InvPriceStr: strconv.FormatInt(int64(1000-price), 10),
	}

	userBalance, found := typess.INR_BALANCES[userID]
	if !found {
		return CreateJSONResponse("User not found", nil)
	}
	if userBalance.Balance < quantity*price {
		return CreateJSONResponse("Insufficient funds", nil)
	}

	if err := helper.InitializeOrderBook(stockSymbol); err != nil {
		return "", fmt.Errorf("failed to initialize order book: %v", err)
	}

	// orderBook := typess.ORDER_BOOK[stockSymbol]
	// noOrders := orderBook.No
	// yesOrders := orderBook.Yes

	orderBook := typess.ORDER_BOOK[stockSymbol]
	noOrders := &orderBook.No
	yesOrders := &orderBook.Yes

	existingOrders, hasMatchingOrders := (*noOrders)[op.PriceStr]

	fmt.Print("\n checking matching orders in No", hasMatchingOrders)

	var order_result *typess.ProcessResult
	var err1 error

	if !hasMatchingOrders {
		fmt.Print("Starting INverse")
		order_result, err1 = helper.CreateNewInverseOrder(op, noOrders, &userBalance)
		fmt.Print("Creating INverse")
	} else {
		fmt.Print("Starting Existing ")
		order_result, err1 = helper.ProcessExistingOrdersNO(op, existingOrders, noOrders, yesOrders, &userBalance)
	}

	if err1 != nil {
		return "", fmt.Errorf("failed to math order createInverse/Process Exists Order Failed")
	}

	// result, err := ProcessNoOrder(op, noOrders, yesOrders, &userBalance)

	typess.INR_BALANCES[userID] = userBalance

	data := map[string]interface{}{
		"orderBook": typess.ORDER_BOOK[stockSymbol],
		"stockBook": typess.STOCK_BALANCES[userID],
		"note":      order_result.Note,
	}

	go Publish(stockSymbol)

	return CreateJSONResponse("Buy No Order Complete", data)
}

func BuyYesOrder(userID string, stockSymbol string, quantity int32, price int32) (string, error) {

	if quantity <= 0 {
		return CreateJSONResponse("Invalid quantity", nil)
	}

	if price <= 0 || price >= 1000 {
		return CreateJSONResponse("Invalid price", nil)
	}

	op := typess.OrderBookOperation{
		UserID:      userID,
		StockSymbol: stockSymbol,
		Quantity:    quantity,
		Price:       price,
		InvPrice:    1000 - price,
		PriceStr:    strconv.FormatInt(int64(price), 10),
		InvPriceStr: strconv.FormatInt(int64(1000-price), 10),
	}

	userBalance, found := typess.INR_BALANCES[userID]

	if !found {
		return CreateJSONResponse("User not found", nil)
	}
	if userBalance.Balance < quantity*price {
		return CreateJSONResponse("Insufficient funds", nil)
	}

	if err := helper.InitializeOrderBook(stockSymbol); err != nil {
		return "", fmt.Errorf("failed to initialize order book: %v", err)
	}

	orderBook := typess.ORDER_BOOK[stockSymbol]
	noOrders := &orderBook.No
	yesOrders := &orderBook.Yes

	// result, err := ProcessYesOrder(op, noOrders, yesOrders, &userBalance)

	existingOrders, hasMatchingOrders := (*yesOrders)[op.PriceStr]

	fmt.Print("checking matching orders in Yes", hasMatchingOrders)

	var order_result *typess.ProcessResult
	var err1 error

	if !hasMatchingOrders {
		order_result, err1 = helper.CreateNewInverseOrder(op, noOrders, &userBalance)

	} else {
		order_result, err1 = helper.ProcessExistingOrdersYes(op, existingOrders, noOrders, yesOrders, &userBalance)
	}

	if err1 != nil {
		return "", fmt.Errorf("failed to math order createInverse/Process Exists Order Failed")
	}

	typess.INR_BALANCES[userID] = userBalance

	data := map[string]interface{}{
		"orderBook": typess.ORDER_BOOK[stockSymbol],
		"stockBook": typess.STOCK_BALANCES[userID],
		"note":      order_result.Note,
	}

	go Publish(stockSymbol)

	return CreateJSONResponse("Buy Yes Order Complete", data)
}

// func ProcessNoOrder(
// 	op typess.OrderBookOperation,
// 	noOrders typess.Outcome,
// 	yesOrders typess.Outcome,
// 	userBalance *typess.UserBalance,
// ) (*typess.ProcessResult, error) {

// 	existingOrders, hasMatchingOrders := noOrders[op.PriceStr]

// 	if !hasMatchingOrders {
// 		return helper.CreateNewInverseOrder(op, yesOrders, userBalance)
// 	}

// 	return helper.ProcessExistingOrders(op, existingOrders, noOrders, yesOrders, userBalance)
// }
