import NavbarUser from "./NavbarUser";
import Footer from "./Footer";
import { useQuery } from "react-query";
import { HTTP_SERVER_URL } from "../constants/const";
import axios from "axios";

const Account = () => {
    const { isLoading, isError, isSuccess, data, error } = useQuery({
        queryKey: ['userBalance'],
        queryFn: async () => {
            const response = await axios.get(`${HTTP_SERVER_URL}/balance/inr/buyer1`);
            return response.data.data;
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {(error as Error).message}</div>;
    }

    if (isSuccess && data) {
        return (
            <div className="justify-between">
                <NavbarUser balance={data.balance / 100} />

                <div className="flex flex-col h-screen">
                    <div className="flex gap-4 text-4xl px-2">
                        <div>Top balance</div>
                        <div>₹ {data.balance / 100}</div>
                    </div>

                    <div className="w-full flex gap-2 mt-4">
                        <div className="w-1/3 flex flex-col items-center bg-slate-50 py-5 justify-between gap-5">
                            <img width={50} height={50} src="https://probo.gumlet.io/image/upload/probo_product_images/deposit_wallet_icon.png" alt="Deposit Icon" />
                            <div className="font-semibold">Deposit</div>
                            <div className="text-xl font-semibold">₹ {data.balance / 100}</div>
                            <button className="text-white bg-black px-8 py-2">Recharge</button>
                        </div>

                        <div className="w-1/3 flex flex-col items-center bg-slate-50 py-5 justify-between gap-5">
                            <img width={50} height={50} src="https://probo.gumlet.io/image/upload/probo_product_images/winnings_wallet_icon.png" alt="Winning Icon" />
                            <div className="font-semibold">Winning</div>
                            <div className="text-xl font-semibold">₹ {0}</div>
                            <button className="text-white bg-black px-8 py-2">Recharge</button>
                        </div>

                        <div className="w-1/3 flex flex-col items-center bg-slate-50 py-5 justify-between gap-5">
                            <img width={50} height={50} src="https://probo.gumlet.io/image/upload/probo_product_images/promotional_wallet_icon.png" alt="Referral Icon" />
                            <div className="font-semibold">Referral</div>
                            <div className="text-xl font-semibold">₹ {0}</div>
                            <button className="text-white bg-black px-8 py-2">Recharge</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return null; 
};

export default Account;
