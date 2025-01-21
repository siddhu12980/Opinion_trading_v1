import React, { useState } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { Wallet, Gift, RefreshCw, Lock } from "lucide-react";

import Footer from "../Home/Footer";

import GiftModel from "./GiftModel";
import UserStockDetails from "./UserStockDetails";
import { userState } from "../../Store/atom";
import { useMutation, useQuery } from "react-query";
import { HTTP_SERVER_URL } from "../../constants/const";
import { processOrderBooks } from "../../helper/helper";
import { queryClient } from "../../App";
import { toast } from "sonner";
import { RechargeModal } from "./RechargeModal";
import WalletCard from "./WalletCard";
import NavbarUser from "../Home/NavbarUser";
import Txn from "./Txn";

const Account = () => {
  const [user, setUser] = useRecoilState(userState);
  const [addedAmount, setAddedAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAmountAddedModel, setShowAmountAddedModel] = useState(false);

  const {
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    isSuccess: isBalanceSuccess,
    data: balanceData,
    error: balanceError,
  } = useQuery({
    queryKey: ["userBalance"],
    queryFn: async () => {
      const response = await axios.get(
        `${HTTP_SERVER_URL}/balance/inr/${user.userId}`
      );
      return response.data.data;
    },
  });

  const stockData = useQuery({
    queryKey: ["event"],
    queryFn: async () => {
      const response = await axios.get(`${HTTP_SERVER_URL}/symbol/all`);
      let processed_data = null;

      if (response.data.data) {
        processed_data = processOrderBooks(response.data.data, user.userId);
      }

      return processed_data;
    },
  });

  const userPersonalStockData = useQuery({
    queryKey: ["userStocks"],
    queryFn: async () => {
      const response = await axios.get(
        `${HTTP_SERVER_URL}/balance/stock/${user.userId}`
      );

      setUser((prev) => ({
        ...prev,
        stock: response.data.data,
      }));

      if (!response.data.data) {
        return null;
      }

      return response.data.data;
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (amount: number) => {
      const response = await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, {
        userId: user.userId,
        amount: amount * 100,
      });

      console.log("Add balance response", response.data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["userBalance"] });
      setIsModalOpen(false);
      setShowAmountAddedModel(true);

      setTimeout(() => {
        setShowAmountAddedModel(false);
      }, 3000);
    },
    onError: (error) => {
      console.error("Add balance error:", error);
      toast.error("Error adding balance to the account");
    },
  });

  const handleAddBalance = async (amount: number) => {
    setAddedAmount(amount);
    await mutateAsync(amount);
  };

  if (isBalanceLoading || userPersonalStockData.isLoading)
    return <div className="text-center py-10">Loading...</div>;
  if (!user.userId)
    return <div className="text-center py-10">Not logged in</div>;
  if (isBalanceError)
    return (
      <div className="text-center py-10 text-red-500">
        {"Something went wrong"}
      </div>
    );

  return (
    <div className="min-h-screen w-full ">
      <NavbarUser />

      <div className="container  px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Wallet className="mr-3 text-blue-500" size={32} />
            Account Balance
            <span className="ml-4 text-green-600">
              ₹ {balanceData.balance / 100}
            </span>
          </h1>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <WalletCard
            icon={<Wallet className="text-blue-500" size={24} />}
            title="Deposit"
            amount={balanceData.balance / 100}
            action={() => setIsModalOpen(true)}
            actionLabel="Recharge"
          />
          <WalletCard
            icon={<Gift className="text-green-500" size={24} />}
            title="Winning"
            amount={0}
          />
          <WalletCard
            icon={<RefreshCw className="text-purple-500" size={24} />}
            title="Referral"
            amount={0}
          />
          <WalletCard
            icon={<Lock className="text-red-500" size={24} />}
            title="Locked Balance"
            amount={balanceData.locked / 100}
          />
        </div>
        {/* Modals and Overlays */}
        <RechargeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddBalance={handleAddBalance}
        />
        {showAmountAddedModel && <GiftModel amount={addedAmount * 100} />}

        {/* Stock and Transaction Sections */}
        <div className="space-y-8">
          {stockData.isLoading ? (
            <div className="text-center py-10">Loading Stock Data...</div>
          ) : stockData.isError ? (
            <div className="text-center py-10 text-red-500">
              {"Something went wrong"}
            </div>
          ) : stockData.data ? (
            <Txn orders={stockData.data} />
          ) : (
            <div className="text-center py-10">No Order Data Available</div>
          )}

          {userPersonalStockData.data && (
            <UserStockDetails stockData={userPersonalStockData.data} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
