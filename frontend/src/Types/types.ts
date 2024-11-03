export type OrderType = "Yes" | "No";
export type TradeType = "Buy" | "Sell";

export interface NumberInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  subtitle?: string;
  step?: number;
  min?: number;
  max:number
}

export interface PriceButtonProps {
  type: OrderType | TradeType;
  price?: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'trade' | 'price';
}

