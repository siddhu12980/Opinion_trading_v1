import { useNavigate } from "react-router-dom";
import { Stockdata } from "./EventComp";

export default function ScrollCard({ data }: { data: Stockdata }) {
  console.log("Data ScrollCard", data);
  const navigate = useNavigate();
  let firstYesPrice = "5";

  let YesPrice = Object.keys(data.orderBook.yes); // First key

  if (YesPrice.length > 0 && YesPrice) {
    const p = YesPrice[0];
    firstYesPrice = (Number(parseInt(p).toFixed(2)) / 100).toString();
  }

  let firstNoPrice = "5";

  let NoPrice = Object.keys(data.orderBook.no); // First key

  if (NoPrice.length > 0 && NoPrice) {
    const p = NoPrice[0];
    firstNoPrice = (Number(parseInt(p).toFixed(2)) / 100).toString();
  }

  return (
    <div
      className="flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5  cursor-pointer  "
      onClick={() => navigate(`/order/${data.stockSymbol}`)}
    >
      <div className=" flex justify-between items-center   ">
        <img
          height="60px"
          width="60px"
          src="https://probo.in/_next/image?url=https%3A%2F%2Fgumlet-images-bucket.s3.ap-south-1.amazonaws.com%2Fprobo_product_images%2FIMAGE_f19f81af-fdf7-47da-b360-c990246b148f.png&w=128&q=75"
          alt="probo"
        />

        <p>
          <span className="text-xl font-medium text-[#262626] font-work-sans">
            {data.stockSymbol}
          </span>
        </p>
      </div>

      <div className="flex ">
        <img
          height="20px"
          width="20px"
          src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FBar_Chart.png&w=32&q=75"
          alt=""
        />{" "}
        <h1 className="text-sm text-[#545454] font-work-sans">
          {YesPrice.length} Trades
        </h1>
      </div>

      <p className="mt-1 text-xl font-medium uppercase text-[#262626] font-work-sans">
        {data.title}
      </p>
      <div className="flex justify-between mx-auto mt-7">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-100 dark:focus:ring-blue-300 font-medium rounded-md text-sm px-6 py-1 text-center me-2 mb-2"
        >
          Yes ₹ <span>{firstYesPrice}</span>
        </button>

        <button
          type="button"
          className="text-white bg-gradient-to-r from-red-300 via-red-400 to-red-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-300 font-medium rounded-md text-sm px-6 py-2.5 text-center me-2 mb-2"
        >
          No ₹ {firstNoPrice}
        </button>
      </div>
    </div>
  );
}
