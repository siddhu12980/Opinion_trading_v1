import NavbarUser from "./NavbarUser";
import Footer from "./Footer";
import { useMutation, useQuery } from "react-query";
import { HTTP_SERVER_URL } from "../constants/const";
import axios from "axios";
import { userState } from "../Store/atom";
import { useRecoilValue } from "recoil";
import Txn from "./Txn";
import { useState } from "react";
import { RechargeModal } from "./RechargeModal";
import { queryClient } from "../App";
import { processOrderBooks } from "../helper/helper";

const Account = () => {
  const user = useRecoilValue(userState);

  console.log(user);

  const { isLoading, isError, isSuccess, data, error } = useQuery({
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
      const response = await axios.get(
        `${HTTP_SERVER_URL}/symbol/all`
      );

      console.log("All Stock Response", response.data);

      if (!response.data.data) {
        throw new Error("No data");
      }

      const processed_data = processOrderBooks(response.data.data, user.userId);

      console.log("Processed Data", data);

      return processed_data;
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: async (amount: number) => {
      const response = await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, {
        userId: user.userId,
        amount: amount * 100,
      });

      console.log("Add balance response:", response.data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userBalance"] });
    },
    onError: (error) => {
      console.error("Add balance error:", error);
    },
  });

  const handleAddBalance = async (amount: number) => {
    await mutateAsync(amount);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user.userId) {
    return <div>Not logged in</div>;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }
  if (isSuccess && data) {
    return (
      <div className="justify-between">
        <NavbarUser balance={data.balance} />

        <div className="flex flex-col h-screen">
          <div className="flex gap-4 text-4xl px-2">
            <div>Top balance</div>
            <div>₹ {data.balance / 100}</div>
          </div>

          <div className="w-full flex gap-5 mt-4">
            <div className="w-1/4 flex flex-col items-center bg-slate-50 py-5 justify-between gap-5">
              <img
                width={50}
                height={50}
                src="https://probo.gumlet.io/image/upload/probo_product_images/deposit_wallet_icon.png"
                alt="Deposit Icon"
              />
              <div className="font-semibold">Deposit</div>
              <div className="text-xl font-semibold">
                ₹ {data.balance / 100}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-white bg-black px-8 py-2"
              >
                Recharge
              </button>
            </div>

            <RechargeModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddBalance={handleAddBalance}
            />

            <div className="w-1/4 flex flex-col items-center bg-slate-50 py-5 justify-between gap-2">
              <img
                width={50}
                height={50}
                src="https://probo.gumlet.io/image/upload/probo_product_images/winnings_wallet_icon.png"
                alt="Winning Icon"
              />
              <div className="font-semibold">Winning</div>
              <div className="text-xl font-semibold">₹ {0}</div>
            </div>

            <div className="w-1/4 flex flex-col items-center bg-slate-50 py-5 justify-between gap-2">
              <img
                width={50}
                height={50}
                src="https://probo.gumlet.io/image/upload/probo_product_images/promotional_wallet_icon.png"
                alt="Referral Icon"
              />
              <div className="font-semibold">Referral</div>
              <div className="text-xl font-semibold">₹ {0}</div>
            </div>

            <div className="w-1/4 flex flex-col items-center bg-slate-50 py-5 justify-between gap-2">
              <img
                width={50}
                height={50}
                src="https://probo.gumlet.io/image/upload/probo_product_images/deposit_wallet_icon.png"
                alt="Deposit Icon"
              />
              <div className="font-semibold">Locked Balance</div>
              <div className="text-xl font-semibold">₹ {data.locked / 100}</div>
            </div>
          </div>

          <div>
            {stockData.isLoading && (
              <div className=" flex justify-center items-center h-screen">
                Loading...
              </div>
            )}
            {stockData.isError && (
              <div className=" flex justify-center items-center h-screen">
                Error: {(stockData.error as Error).message}
              </div>
            )}

            {stockData.isSuccess && stockData.data ? (
              <Txn orders={stockData.data} />
            ) : null}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return null;
};

export default Account;
