package typess

type ProcessResult struct {
	Note         string
	RemainingQty int32
}

type OrderBookOperation struct {
	UserID      string
	StockSymbol string
	Quantity    int32
	Price       int32
	InvPrice    int32
	PriceStr    string
	InvPriceStr string
}

type UserBalance struct {
	Balance int32 `json:"balance"`
	Locked  int32 `json:"locked"`
}

type OrderType string

const (
	Normal  OrderType = "normal"
	Inverse OrderType = "inverse"
)

type OrderTypeYesNo string

const (
	Yes OrderTypeYesNo = "Yes"
	NO  OrderTypeYesNo = "No"
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
			"950": &Order{
				Total: 12,
				Orders: map[string]OrderTypes{
					"user1": {Normal: 10, Inverse: 2},
					"user2": {Normal: 5, Inverse: 7},
				},
			},
			"800": &Order{
				Total: 15,
				Orders: map[string]OrderTypes{
					"user3": {Normal: 12, Inverse: 3},
				},
			},
		},
		No: Outcome{
			"800": &Order{
				Total: 10,
				Orders: map[string]OrderTypes{
					"user4": {Normal: 8, Inverse: 2},
				},
			},
		},
	},
	"eth": {
		Yes: Outcome{
			"150": &Order{
				Total: 22,
				Orders: map[string]OrderTypes{
					"user5": {Normal: 20, Inverse: 2},
				},
			},
		},
		No: Outcome{
			"700": &Order{
				Total: 25,
				Orders: map[string]OrderTypes{
					"user6": {Normal: 18, Inverse: 7},
				},
			},
		},
	},
}

var INR_BALANCES = map[string]UserBalance{
	"user1": {Balance: 10000, Locked: 50000},
	"user2": {Balance: 15000, Locked: 30000},
}

var STOCK_BALANCES = map[string]UserStockBalances{
	"user1": {
		"btc": {Yes: &Stock{Quantity: 50, Locked: 10}, No: &Stock{Quantity: 30, Locked: 5}},
		"eth": {Yes: &Stock{Quantity: 0, Locked: 0}, No: nil},
	},
	"user2": {
		"eth": {Yes: nil, No: &Stock{Quantity: 60, Locked: 15}},
		"btc": {Yes: &Stock{Quantity: 200, Locked: 30}, No: &Stock{Quantity: 150, Locked: 40}},
	},
}
