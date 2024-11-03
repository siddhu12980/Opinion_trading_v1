import { useRecoilValue } from "recoil";
import NavbarUser from "./NavbarUser";
import OrderBook from "./OrderBook";
import PlaceOrder from "./PlaceOrder";
import Tradeheader from "./Tradeheader";
import { userState } from "../Store/atom";

const TradeScreen = () => {
  const userBalance = useRecoilValue(userState)
  return (
    <>
      <NavbarUser balance={userBalance.balance} />
      <div className="flex flex-col  pt-5 ">
        <div>
          <Tradeheader />
        </div>
        <div className="w-full mx-auto flex gap-10">

          <div className="w-[67%]">
            {" "}
            <OrderBook />
          </div>
          <div className="w-[30%]">
            <PlaceOrder />
          </div>
        </div>
      </div>
    </>
  );
}

export default TradeScreen
