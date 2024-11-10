import { useRecoilValue } from "recoil"
import NavbarUser from "./NavbarUser"
import { userState } from "../Store/atom"
import Footer from "./Footer"

const Account = () => {
    const userBalance = useRecoilValue(userState)



    return (
        <div  className=" justify-between">
            <NavbarUser balance={userBalance.balance} />

            <div className=" flex flex-col h-screen">
                <div className=" flex gap-4 text-4xl px-2">
                    <div>Top balance</div>
                    <div>
                        ₹ {userBalance.balance}
                    </div>
                </div>

                <div className=" w-full flex gap-2 mt-4">

                    <div className=" w-1/3 flex flex-col items-center bg-slate-50 py-5 justify-between gap-5">
                        <div><img width={50} height={50} src="	https://probo.gumlet.io/image/upload/probo_product_images/deposit_wallet_icon.png" /></div>
                        <div className="  font-semibold">Deposit</div>
                        <div className=" text-xl font-semibold">₹ {userBalance.balance}</div>
                        <div className=" w-full"> <button className=" text-white bg-black px-8 py-2 ">Recharge</button></div>
                    </div>

                    <div className=" w-1/3 flex flex-col items-center bg-slate-50 py-5 justify-between gap-5">
                        <div><img width={50} height={50} src="	https://probo.gumlet.io/image/upload/probo_product_images/winnings_wallet_icon.png" /></div>
                        <div className="  font-semibold">Winning</div>
                        <div className=" text-xl font-semibold">₹ {userBalance.balance}</div>
                        <div className=" w-full"> <button className=" text-white bg-black px-8 py-2 ">Recharge</button></div>
                    </div>

                    <div className=" w-1/3 flex flex-col items-center bg-slate-50 py-5 justify-between gap-5">
                        <div><img width={50} height={50} src="https://probo.gumlet.io/image/upload/probo_product_images/promotional_wallet_icon.png" /></div>
                        <div className="  font-semibold">Referal</div>
                        <div className=" text-xl font-semibold">₹ {userBalance.balance}</div>
                        <div className=" w-full"> <button className=" text-white bg-black px-8 py-2 ">Recharge</button></div>
                    </div>




                </div>



            </div>
            <Footer />

        </div>
    )
}

export default Account
