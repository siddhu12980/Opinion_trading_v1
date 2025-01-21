import React from "react";

const WalletCard = ({
  icon,
  title,
  amount,
  action,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  amount: number;
  action?: () => void;
  actionLabel?: string;
}) => (
  <div className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center justify-between space-y-3 w-full max-w-xs">
    <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    <h3 className="text-gray-700 font-medium">{title}</h3>
    <div className="text-2xl font-bold text-gray-900">
      ₹ {amount.toFixed(2)}
    </div>
    {action && (
      <button
        onClick={action}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default WalletCard;
