package main

import (
	"engine/controller"
	"fmt"
)

func HandleRes(res string, err error) {
	if err != nil {
		fmt.Print(err)
	}
	fmt.Print(res)
}

func main() {

	res, err := controller.GetINRBalance("user122")

	HandleRes(res, err)

	fmt.Printf("\n")

	res2, err2 := controller.GetStockBalance("user1")

	HandleRes(res2, err2)

	fmt.Printf("\n")
	res3, err3 := controller.GetAllINRBalance()

	HandleRes(res3, err3)

	fmt.Printf("\n")

	res4, err4 := controller.GetAllStockBalance()

	HandleRes(res4, err4)

	fmt.Printf("\n \n")

	res5, err5 := controller.CreateSymbol("NEW")

	HandleRes(res5, err5)

	fmt.Printf("\n \n")

	res6, err6 := controller.GetOrderbook("BTC")

	HandleRes(res6, err6)

	fmt.Printf("\n \n")

	res7, err7 := controller.CreateSymbol("NEW")

	HandleRes(res5, err5)

}
