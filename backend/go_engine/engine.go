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
	GetStockBalance ReqType = iota + 1
	GetINRBalance
	GetAllINRBalance
	BuyNoOrder
	BuyYesOrder
	GetAllStockBalance
	CreateSymbol
	GetOrderbook
	GetAllOrderbook
	MintStock
	OnRampINR
	Reset
	SellOrder
	CreateUser
	GetAllMarkets
	GetAMarket
	GetUser
)

var client *redis.Client

func InitRedis() {
	url, err := controller.ENVVariable("REDIS_URL")

	if err != nil {
		log.Fatalf("Could not parse Redis URL: %v", err)
	}

	//"redis://localhost:6379"
	opt, err := redis.ParseURL(url)

	if err != nil {
		log.Fatalf("Could not parse Redis URL: %v", err)
	}
	client = redis.NewClient(opt)
}

func handleReq(reqType ReqType, msg Message, ctx context.Context) {
	switch reqType {
	case GetStockBalance:
		log.Println("Processing: GetStockBalance")
		res, err := controller.GetStockBalance(msg.UserID)
		HandleRes(res, err, msg.ID, ctx)

	case GetINRBalance:
		log.Println("Processing: GetINRBalance")
		res, err := controller.GetINRBalance(msg.UserID)
		HandleRes(res, err, msg.ID, ctx)

	case GetAllINRBalance:
		log.Println("Processing: GetAllINRBalance")
		res, err := controller.GetAllINRBalance()
		HandleRes(res, err, msg.ID, ctx)

	case BuyNoOrder:
		log.Println("Processing: BuyNoOrder")
		res, err := controller.BuyNoOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID, ctx)

	case BuyYesOrder:
		log.Println("Processing: BuyYesOrder")
		res, err := controller.BuyYesOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID, ctx)

	case GetAllStockBalance:
		log.Println("Processing: GetAllStockBalance")
		res, err := controller.GetAllStockBalance()
		HandleRes(res, err, msg.ID, ctx)

	case CreateSymbol:
		log.Println("Processing: CreateSymbol")
		res, err := controller.CreateSymbol(msg.StockSymbol, msg.Title)
		HandleRes(res, err, msg.ID, ctx)

	case GetOrderbook:
		log.Println("Processing: GetOrderbook")
		res, err := controller.GetOrderbook(msg.StockSymbol)
		HandleRes(res, err, msg.ID, ctx)

	case GetAllOrderbook:
		log.Println("Processing: GetAllOrderbook")
		res, err := controller.GetAllOrderbook()
		HandleRes(res, err, msg.ID, ctx)

	case MintStock:
		log.Println("Processing: MintStock")
		res, err := controller.MintStock(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID, ctx)

	case OnRampINR:
		log.Println("Processing: OnRampINR")
		res, err := controller.Onramp(msg.UserID, int32(msg.Amount))
		HandleRes(res, err, msg.ID, ctx)

	case Reset:
		log.Println("Processing: Reset")
		res, err := controller.Reset()
		HandleRes(res, err, msg.ID, ctx)

	case SellOrder:
		log.Println("Processing: SellOrder")
		res, err := controller.SellOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price), msg.StockType)
		HandleRes(res, err, msg.ID, ctx)

	case CreateUser:
		log.Println("Processing: CreateUser")
		res, err := controller.CreateUser(msg.UserID)
		HandleRes(res, err, msg.ID, ctx)

	case GetAllMarkets:
		log.Println("Processing: GetAllMarkets")
		res, err := controller.GetAllSymbolAndTitle()
		HandleRes(res, err, msg.ID, ctx)

	case GetAMarket:
		log.Println("Processing: GetAMarket")
		res, err := controller.GetAMarket(msg.StockSymbol)
		HandleRes(res, err, msg.ID, ctx)

	case GetUser:
		log.Println("Processing: GetUser")
		res, err := controller.GetUser(msg.UserID)
		HandleRes(res, err, msg.ID, ctx)

	default:
		log.Println("Unknown Request Type")
	}
}

func HandleRes(res string, err error, id string, ctx context.Context) {
	fmt.Println("hello")

	if client == nil {
		InitRedis()
	}

	if id == "" {
		log.Println("No ID provided in message")

	}

	if err != nil {
		log.Printf("Error at Response: %v", err)
		response := map[string]interface{}{"error": err}

		jsonResponse, err := json.Marshal(response)

		if err != nil {
			fmt.Printf("Error While Parsing error")
		}

		err_res := string(jsonResponse)

		if err := client.Publish(ctx, id, err_res).Err(); err != nil {
			log.Printf("Failed to publish response: %v", err)
		}

	} else {
		log.Printf("Sending Response: %v \n ", res)
		log.Printf("End state var: order book %v \n stock book %v \n inrBalance %v \n", typess.ORDER_BOOK, typess.STOCK_BALANCES, typess.INR_BALANCES)

		senData := map[string]interface{}{
			"type": "event",
			"data": res,
		}

		jsonResponse, err := json.Marshal(senData)

		if err != nil {
			fmt.Printf("Error While Parsing error")
		}

		resStr := string(jsonResponse)

		if err := client.LPush(ctx, "db", resStr).Err(); err != nil {
			log.Printf("Failed to publish response: %v", err)
		}

		if err := client.Publish(ctx, id, res).Err(); err != nil {
			log.Printf("Failed to publish response: %v", err)
		}

	}
}

type Message struct {
	ID          string                `json:"id"`               // Required
	Req         int                   `json:"req"`              // Required
	UserID      string                `json:"userId,omitempty"` // Optional, empty string if missing
	StockSymbol string                `json:"stockSymbol,omitempty"`
	Title       string                `json:"title,omitempty"`
	Quantity    int                   `json:"quantity,omitempty"`
	Price       int                   `json:"price,omitempty"`
	Message     string                `json:"message,omitempty"`
	Amount      int                   `json:"amount,omitempty"`
	StockType   typess.OrderTypeYesNo `json:"stockType,omitempty"`
}

func worker(ctx context.Context, msgCh <-chan Message) {
	for msg := range msgCh {
		handleReq(ReqType(msg.Req), msg, ctx)
	}
}

func main() {

	log.Println(typess.INR_BALANCES, typess.STOCK_BALANCES, typess.ORDER_BOOK)
	InitRedis()
	ctx := context.Background()

	msgCh := make(chan Message)

	for i := 0; i < 10; i++ {
		go worker(ctx, msgCh)
	}

	for {
		reqData, err := client.BRPop(ctx, 0, "req").Result()

		if err != nil {
			log.Println("Error fetching from Redis:", err)
			continue
		}

		var msg Message
		if err := json.Unmarshal([]byte(reqData[1]), &msg); err != nil {
			log.Println("Error unmarshalling JSON:", err)
			continue
		}

		if msg.ID == "" || msg.Req == 0 {
			log.Println("Missing required fields: ID or Req")
			continue
		}

		log.Printf("Start process state var: order book %v \n stock book %v \n inrBalance %v \n", typess.ORDER_BOOK, typess.STOCK_BALANCES, typess.INR_BALANCES)

		log.Printf("\n \n \n Received Message: %+v", msg)
		msgCh <- msg
	}
}
