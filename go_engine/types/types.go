package typess

type UserBalance struct {
	Balance int32 `json:"balance"`
	Locked  int32 `json:"locked"`
}

type OrderType string

const (
	Normal  OrderType = "normal"
	Inverse OrderType = "inverse"
)

type Stock struct {
	Quantity int32 `json:"quantity"`
	Locked   int32 `json:"locked"`
}

type UserStockBalances map[string]struct {
	Yes *Stock `json:"yes,omitempty"`
	No  *Stock `json:"no,omitempty"`
}

// type StockBalances map[string]UserStockBalances

type OrderTypes struct {
	Normal  int `json:"normal"`
	Inverse int `json:"inverse"`
}

type Order struct {
	Total  int                   `json:"total"`
	Orders map[string]OrderTypes `json:"orders"`
}

type Outcome map[string]*Order // Mapping price level directly to an Order

type OrderBookEntry struct {
	Yes Outcome `json:"yes"`
	No  Outcome `json:"no"`
}

var ORDER_BOOK = map[string]OrderBookEntry{
	"btc": {
		Yes: Outcome{
			"9.5": &Order{
				Total: 12,
				Orders: map[string]OrderTypes{
					"user1": {Normal: 10, Inverse: 2},
					"user2": {Normal: 5, Inverse: 7},
				},
			},
			"10": &Order{
				Total: 15,
				Orders: map[string]OrderTypes{
					"user3": {Normal: 12, Inverse: 3},
				},
			},
		},
		No: Outcome{
			"8": &Order{
				Total: 10,
				Orders: map[string]OrderTypes{
					"user4": {Normal: 8, Inverse: 2},
				},
			},
		},
	},
	"eth": {
		Yes: Outcome{
			"18.5": &Order{
				Total: 22,
				Orders: map[string]OrderTypes{
					"user5": {Normal: 20, Inverse: 2},
				},
			},
		},
		No: Outcome{
			"17": &Order{
				Total: 25,
				Orders: map[string]OrderTypes{
					"user6": {Normal: 18, Inverse: 7},
				},
			},
		},
	},
	"ltc": {
		Yes: Outcome{
			"5.2": &Order{
				Total: 30,
				Orders: map[string]OrderTypes{
					"user7": {Normal: 28, Inverse: 2},
					"user8": {Normal: 10, Inverse: 0},
				},
			},
		},
		No: Outcome{
			"4.8": &Order{
				Total: 20,
				Orders: map[string]OrderTypes{
					"user9": {Normal: 15, Inverse: 5},
				},
			},
		},
	},
}

var INR_BALANCES = map[string]UserBalance{
	"user1": {Balance: 1000.0, Locked: 500.0},
	"user2": {Balance: 1500.0, Locked: 300.0},
}

var STOCK_BALANCES = map[string]UserStockBalances{
	"user1": {
		"btc": {Yes: &Stock{Quantity: 50, Locked: 10}, No: &Stock{Quantity: 30, Locked: 5}},
		"eth": {Yes: &Stock{Quantity: 100, Locked: 20}, No: nil},
	},
	"user2": {
		"eth": {Yes: nil, No: &Stock{Quantity: 60, Locked: 15}},
		"btc": {Yes: &Stock{Quantity: 200, Locked: 30}, No: &Stock{Quantity: 150, Locked: 40}},
	},
}
