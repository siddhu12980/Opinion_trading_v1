import { MinusCircle, PlusCircle } from "lucide-react";
import { NumberInputProps, PriceButtonProps } from "../Types/types";

export const NumberInput: React.FC<NumberInputProps> = ({
    label,
    value,
    onChange,
    subtitle,
    step = 0.5,
    max,
    min = 0,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue === '' || !isNaN(Number(newValue))) {
            onChange(newValue);
        }
    };

    const handleIncrement = () => {
        const currentValue = Number(value);
        if (!isNaN(currentValue) && currentValue < max) {
            onChange((currentValue + step).toFixed(1));
        }
    };

    const handleDecrement = () => {
        const currentValue = Number(value);
        if (!isNaN(currentValue) && currentValue > min) {
            onChange((currentValue - step).toFixed(1));
        }
    };

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{label}</h3>
                {label === "Quantity" && <span className="text-slate-400">⚙</span>}
            </div>
            {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                <button
                    onClick={handleDecrement}
                    className="p-2 text-blue-500 hover:bg-slate-100 rounded-lg"
                >
                    <MinusCircle size={20} />
                </button>
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    className="w-full text-center bg-transparent focus:outline-none"
                />
                <button
                    onClick={handleIncrement}
                    className="p-2 text-blue-500 hover:bg-slate-100 rounded-lg"
                >
                    <PlusCircle size={20} />
                </button>
            </div>
        </div>
    );
};




export const ActionButton: React.FC<PriceButtonProps> = ({
    type,
    price,
    isActive,
    onClick,
    variant = 'price'
}) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2 rounded-full text-sm transition-colors 
      ${isActive
                ? 'bg-white shadow-sm'
                : 'text-slate-500 hover:bg-white text-opacity-50 hover:shadow-sm'
            } 
      ${variant === 'trade'
                ? (type === "Buy" ? 'text-green-500' : 'text-red-500')
                : (type === "Yes" ? 'text-blue-500' : 'text-red-400')
            }
    `}
    >
        {type} {price && `₹${price}`}
    </button>
);
