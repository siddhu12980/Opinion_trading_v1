import { Stockdata } from "./EventComp";
import { useNavigate } from "react-router-dom";

const MainStory = ({ data }: { data: Stockdata }) => {
  const navigate = useNavigate();

  let firstYesPrice = "5";

  let YesPrice = Object.keys(data.orderBook.yes); // First key

  if (YesPrice.length > 0 && YesPrice) {
    firstYesPrice = YesPrice[0];
  }

  let firstNoPrice = "5";

  let NoPrice = Object.keys(data.orderBook.no); // First key

  if (NoPrice.length > 0 && NoPrice) {
    firstNoPrice = NoPrice[0];
  }

  const calculatePercentage = () => {
    return parseFloat(firstYesPrice) > parseFloat(firstNoPrice)
      ? parseFloat(firstYesPrice) * 10
      : parseFloat(firstNoPrice) * 10;
  };

  function FindHigh(yes: string, no: string) {
    const yes1 = parseFloat(yes);

    const no1 = parseFloat(no);

    if (yes1 > no1) return true;

    return false;
  }

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Left Section */}
        <div
          onClick={() => navigate(`/order/${data.stockSymbol}`)}
          className="flex flex-col space-y-4  justify-between  lg:gap-10  md:gap-1   cursor-pointer "
        >
          {/* Header with Icon and Symbol */}
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden ">
              <img
                className="w-full h-full object-cover"
                src="https://probo.in/_next/image?url=https%3A%2F%2Fgumlet-images-bucket.s3.ap-south-1.amazonaws.com%2Fprobo_product_images%2FIMAGE_f19f81af-fdf7-47da-b360-c990246b148f.png&w=128&q=75"
                alt={data.stockSymbol}
              />
            </div>
            <h1 className="text-2xl text-gray-800 font-semibold font-work-sans">
              {data.stockSymbol}
            </h1>
          </div>

          {/* Title */}
          <p className="text-2xl text-gray-800 font-work-sans font-bold leading-tight">
            {data.title}
          </p>

          {/* Trading Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
            <span className="text-gray-600 font-medium">Trades</span>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
              <button
                type="button"
                className="flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-8 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Yes ₹{firstYesPrice}
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:from-red-500 hover:to-red-700 focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-8 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                No ₹{firstNoPrice}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center lg:items-end gap-4">
          <div className="flex items-center justify-between w-full max-w-[300px] bg-gray-50 rounded-lg p-3">
            <div className="flex flex-col">
              {/* color red when red is high blue text when yes is high  */}
              <span
                className={`text-lg font-bold 
                ${
                  FindHigh(firstYesPrice, firstNoPrice)
                    ? `text-blue-400`
                    : `text-red-500`
                }  `}
              >
                {calculatePercentage()}%
              </span>
              <span className="text-sm text-gray-500 font-work-sans">
                {parseInt(firstYesPrice) > parseInt(firstNoPrice)
                  ? "Yes"
                  : "No"}
              </span>
            </div>
            <button
              className="rounded-full bg-blue-600 p-2.5 text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200 focus:ring-4 focus:ring-blue-200"
              type="button"
              aria-label="Like"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </button>
          </div>
          <div className="relative w-full max-w-[300px] h-[200px] rounded-lg overflow-hidden">
            <img
              className="absolute inset-0 w-full h-full object-contain"
              src="https://probo.in/_next/image?url=%2Fassets%2Fimages%2Fevents%2Fimages%2Fdownload.png&w=256&q=75"
              alt="Event"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainStory;
