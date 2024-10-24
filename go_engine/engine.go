package main

import (
	"context"
	"encoding/json"
	"engine/controller"
	typess "engine/types"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

type ReqType int

const (
	_                  ReqType = iota
	GetStockBalance            // 0
	GetINRBalance              // 1
	GetAllINRBalance           // 2
	BuyNoOrder                 // 3
	BuyYesOrder                // 4
	GetAllStockBalance         // 5
	CreateSymbol               // 6
	GetOrderbook               // 7
	GetAllOrderbook            // 8
	MintStock                  // 9
	OnRampINR                  // 10
	Reset                      // 11
	SellOrder                  // 12
	CreateUser                 // 13
)

func handleReq(reqType ReqType, msg Message) {
	switch reqType {
	case GetStockBalance:

		fmt.Println("Processing: GetStockBalance")

		res, err := controller.GetStockBalance(msg.UserID)

		HandleRes(res, err, msg.ID)

	case GetINRBalance:
		fmt.Println("Processing: GetINRBalance")
		res, err := controller.GetINRBalance(msg.UserID)
		HandleRes(res, err, msg.ID)

	case GetAllINRBalance:
		fmt.Println("Processing: GetAllINRBalance")
		res, err := controller.GetAllINRBalance()
		HandleRes(res, err, msg.ID)

	case BuyNoOrder:
		fmt.Println("Processing: BuyNoOrder")
		res, err := controller.BuyNoOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID)

	case BuyYesOrder:
		fmt.Println("Processing: BuyYesOrder")
		res, err := controller.BuyYesOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID)

	case GetAllStockBalance:
		fmt.Println("Processing: GetAllStockBalance")
		res, err := controller.GetAllStockBalance()
		HandleRes(res, err, msg.ID)

	case CreateSymbol:
		fmt.Println("Processing: CreateSymbol")
		res, err := controller.CreateSymbol(msg.StockSymbol)
		HandleRes(res, err, msg.ID)

	case GetOrderbook:
		fmt.Println("Processing: GetOrderbook")
		res, err := controller.GetOrderbook(msg.StockSymbol)
		HandleRes(res, err, msg.ID)

	case GetAllOrderbook:
		fmt.Println("Processing: GetAllOrderbook")
		res, err := controller.GetAllOrderbook()
		HandleRes(res, err, msg.ID)

	case MintStock:
		fmt.Println("Processing: MintStock")
		res, err := controller.MintStock(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID)

	case OnRampINR:
		fmt.Println("Processing: OnRampINR")
		res, err := controller.Onramp(msg.UserID, int32(msg.Amount))
		HandleRes(res, err, msg.ID)

	case Reset:
		fmt.Println("Processing: Reset")
		res, err := controller.Reset()
		HandleRes(res, err, msg.ID)

	case SellOrder:
		fmt.Println("Processing: SellOrder")
		res, err := controller.SellOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price), msg.StockType)
		HandleRes(res, err, msg.ID)

	case CreateUser:
		fmt.Println("Processing: CreateUser", msg)

		res, err := controller.CreateUser(msg.UserID)
		HandleRes(res, err, msg.ID)

	default:
		fmt.Println("Unknown Request Type")
	}
}

func HandleRes(res string, err error, id string) {

	opt, redis_err := redis.ParseURL("redis://localhost:6379")

	if redis_err != nil {
		panic(redis_err)
	}

	if id == "" {
		panic("NO ID Provided")
	}

	client := redis.NewClient(opt)
	ctx := context.Background()

	if err != nil {
		fmt.Print(err)
	}

	fmt.Print(res)

	data := client.Publish(ctx, id, res)

	fmt.Print(data.Result())

}

type Message struct {
	ID          string                `json:"id"`               // Required
	Req         int                   `json:"req"`              // Required
	UserID      string                `json:"userId,omitempty"` // Optional, empty string if missing
	StockSymbol string                `json:"stockSymbol,omitempty"`
	Quantity    int                   `json:"quantity,omitempty"`
	Price       int                   `json:"price,omitempty"`
	Message     string                `json:"message,omitempty"`
	Amount      int                   `json:"amount,omitempty"`
	StockType   typess.OrderTypeYesNo `json:"stockType,omitempty"`
}

func main() {

	opt, redis_err := redis.ParseURL("redis://localhost:6379")

	if redis_err != nil {
		panic(redis_err)
	}

	client := redis.NewClient(opt)

	ctx := context.Background()

	for true {

		req_data := client.BRPop(ctx, 0, "req")

		data, err := req_data.Result()
		if err != nil {
			fmt.Println("Error fetching from Redis:", err)
			return
		}

		jsonStr := data[1]

		data1 := []byte(jsonStr)

		var msg Message

		fmt.Print("JSon String", jsonStr)

		err = json.Unmarshal(data1, &msg)

		if err != nil {
			fmt.Println(" \n Error unmarshalling JSON:", err)
			return
		}

		if msg.ID == "" || msg.Req == 0 {
			log.Println("Missing required fields: ID or Req")
			return
		}

		fmt.Print(msg)

		fmt.Println("ID:", msg.ID)
		fmt.Println("Req:", msg.Req)

		handleReq(ReqType(msg.Req), msg)

	}

}
