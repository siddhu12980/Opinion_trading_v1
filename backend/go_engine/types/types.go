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
	Yes OrderTypeYesNo = "yes"
	NO  OrderTypeYesNo = "no"
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

var ORDER_BOOK = map[string]OrderBookEntry{}

var INR_BALANCES = map[string]UserBalance{}

var STOCK_BALANCES = map[string]UserStockBalances{}
