package controller

import (
	"encoding/json"
	typess "engine/types"
	"fmt"
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

func MintStock(userId string, stockSymbol string, quantity int32, price int32) (string, error) {
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


export function doCreateUser(user: string) {
	INR_BALANCES[user] = {
	  balance: 0,
	  locked: 0
	};
  
	STOCK_BALANCES[user] = {}
  
	const res = {
	  INR_BALANCES: INR_BALANCES[user],
	  STOCK_BALANCES: STOCK_BALANCES[user],
	  message: "User Created "
	}
	return res
  
  }