package controller

import (
	"encoding/json"
	typess "engine/types"
)

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
