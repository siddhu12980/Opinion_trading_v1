package controller

import (
	"context"
	"encoding/json"
	"engine/helper"
	typess "engine/types"
	"fmt"
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

	stockType := typess.OrderTypeYesNo(stockT)

	if quantity <= 0 {
		return CreateJSONResponse("Invalid quantity", nil)
	}
	if price <= 0 || price >= 1000 {
		return CreateJSONResponse("Invalid price", nil)
	}

	userStockBalance, found := typess.STOCK_BALANCES[userId]
	if !found {
		return CreateJSONResponse("User Not Found", nil)
	}

	userStock, found := userStockBalance[stockSymbol]
	if !found {
		return CreateJSONResponse("User doesn't own the corresponding Stock", nil)
	}

	var stockBalance *typess.Stock
	var outcome typess.Outcome

	if stockType == typess.Yes {
		if userStock.Yes == nil {
			return CreateJSONResponse("User doesn't own any Yes-type stock", nil)
		}
		stockBalance = userStock.Yes
	} else if stockType == typess.NO {
		if userStock.No == nil {
			return CreateJSONResponse("User doesn't own any No-type stock", nil)
		}
		stockBalance = userStock.No
	} else {
		return CreateJSONResponse("Failed during type check", nil)
	}

	if stockBalance.Quantity < quantity {
		return CreateJSONResponse("Insufficient Stock Quantity", nil)
	}

	orderBook, found := typess.ORDER_BOOK[stockSymbol]
	if !found {
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
	} else {
		if orderBook.No == nil {
			orderBook.No = make(typess.Outcome)
		}
		outcome = orderBook.No
	}

	priceStr := strconv.FormatInt(int64(price), 10)

	if _, found := outcome[priceStr]; !found {
		outcome[priceStr] = &typess.Order{
			Total:  0,
			Orders: make(map[string]typess.OrderTypes),
		}
	}

	order := outcome[priceStr]

	if _, found := order.Orders[userId]; !found {
		order.Orders[userId] = typess.OrderTypes{
			Normal:  int(quantity),
			Inverse: 0,
		}
	} else {

		orderTypes := order.Orders[userId]
		orderTypes.Normal += int(quantity)
		order.Orders[userId] = orderTypes

	}
	order.Total += int(quantity)

	stockBalance.Quantity -= quantity
	stockBalance.Locked += quantity

	data := map[string]interface{}{
		"StockBalance": typess.STOCK_BALANCES[userId],
		"OrderBook":    typess.ORDER_BOOK[stockSymbol],
		"Balance":      typess.INR_BALANCES[userId],
	}

	go Publish(stockSymbol)

	return CreateJSONResponse("Sell Order Placed", data)
}

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
