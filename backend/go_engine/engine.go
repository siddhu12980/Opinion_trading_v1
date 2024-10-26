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

var client *redis.Client

func initRedis() {
	opt, err := redis.ParseURL("redis://localhost:6379")
	if err != nil {
		log.Fatalf("Could not parse Redis URL: %v", err)
	}
	client = redis.NewClient(opt)
}

func handleReq(reqType ReqType, msg Message, ctx context.Context) {
	switch reqType {
	case GetStockBalance:
		fmt.Println("Processing: GetStockBalance")
		res, err := controller.GetStockBalance(msg.UserID)
		HandleRes(res, err, msg.ID, ctx)

	case GetINRBalance:
		fmt.Println("Processing: GetINRBalance")
		res, err := controller.GetINRBalance(msg.UserID)
		HandleRes(res, err, msg.ID, ctx)

	case GetAllINRBalance:
		fmt.Println("Processing: GetAllINRBalance")
		res, err := controller.GetAllINRBalance()
		HandleRes(res, err, msg.ID, ctx)

	case BuyNoOrder:
		fmt.Println("Processing: BuyNoOrder")
		res, err := controller.BuyNoOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID, ctx)

	case BuyYesOrder:
		fmt.Println("Processing: BuyYesOrder")
		res, err := controller.BuyYesOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID, ctx)

	case GetAllStockBalance:
		fmt.Println("Processing: GetAllStockBalance")
		res, err := controller.GetAllStockBalance()
		HandleRes(res, err, msg.ID, ctx)

	case CreateSymbol:
		fmt.Println("Processing: CreateSymbol")
		res, err := controller.CreateSymbol(msg.StockSymbol)
		HandleRes(res, err, msg.ID, ctx)

	case GetOrderbook:
		fmt.Println("Processing: GetOrderbook")
		res, err := controller.GetOrderbook(msg.StockSymbol)
		HandleRes(res, err, msg.ID, ctx)

	case GetAllOrderbook:
		fmt.Println("Processing: GetAllOrderbook")
		res, err := controller.GetAllOrderbook()
		HandleRes(res, err, msg.ID, ctx)

	case MintStock:
		fmt.Println("Processing: MintStock")
		res, err := controller.MintStock(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price))
		HandleRes(res, err, msg.ID, ctx)

	case OnRampINR:
		fmt.Println("Processing: OnRampINR")
		res, err := controller.Onramp(msg.UserID, int32(msg.Amount))
		HandleRes(res, err, msg.ID, ctx)

	case Reset:
		fmt.Println("Processing: Reset")
		res, err := controller.Reset()
		HandleRes(res, err, msg.ID, ctx)

	case SellOrder:
		fmt.Println("Processing: SellOrder")
		res, err := controller.SellOrder(msg.UserID, msg.StockSymbol, int32(msg.Quantity), int32(msg.Price), msg.StockType)
		HandleRes(res, err, msg.ID, ctx)

	case CreateUser:
		fmt.Println("Processing: CreateUser")
		res, err := controller.CreateUser(msg.UserID)
		HandleRes(res, err, msg.ID, ctx)

	default:
		log.Println("Unknown Request Type")
	}
}

func HandleRes(res string, err error, id string, ctx context.Context) {
	if id == "" {
		log.Println("No ID provided in message")
		return
	}

	if err != nil {
		log.Printf("Error: %v", err)
	}

	log.Printf("Sending Response: %v", res)
	if err := client.Publish(ctx, id, res).Err(); err != nil {
		log.Printf("Failed to publish response: %v", err)
	}
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

func worker(ctx context.Context, msgCh <-chan Message) {
	for msg := range msgCh {
		handleReq(ReqType(msg.Req), msg, ctx)
	}
}

func main() {
	initRedis()
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

		log.Printf("Received Message: %+v", msg)
		msgCh <- msg // Send message to worker goroutines
	}
}
