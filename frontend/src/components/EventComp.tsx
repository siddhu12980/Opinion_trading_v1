import { useNavigate } from "react-router-dom";
import ScrollCard from "./ScrollCard";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";
import MainStory from "./MainStory";

export interface Stockdata {
  stockSymbol: string;
  title: string;
  orderBook: OrderBookEntry;
}

interface OrderTypes {
  normal: number;
  inverse: number;
}

interface Order {
  total: number;
  orders: Record<string, OrderTypes>; // Using a dictionary-like structure
}

type Outcome = Record<string, Order>;

export interface OrderBookEntry {
  yes: Outcome;
  no: Outcome;
}

export default function EventComp() {
  const nagivate = useNavigate();

  const [sotckData, setStockData] = useState<Stockdata[] | null>(null);

  const description = {
    yes: "probability of yes",
    no: "probability of no",
  };

  const res = useQuery({
    queryKey: ["event"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/v1/symbol/all`
      );

      if (!response.data.data) {
        throw new Error("No data");
      }

      setStockData(response.data.data);

      console.log("Fn res", response.data.data);

      return response.data;
    },
  });

  if (res.isLoading) {
    return <span>Loading...</span>;
  }

  if (res.isError) {
    return <span>Error: {String(res.error)}</span>;
  }

  console.log("Stock Data", sotckData);

  return (
    <section className="mx-6 mt-5 space-y-9">
      <div className="flex flex-col lg:flex-row justify-center lg:gap-x-32 space-y-8 lg:space-y-0">
        {/* Top Stories Section */}
        <div className="flex flex-col max-w-xl space-y-2">
          <h1 className="font-work-sans font-semibold text-left">
            Top Stories
          </h1>
          {sotckData && sotckData.length > 0 ? (
            <MainStory data={sotckData[0]} />
          ) : (
            <span>No Top Bets</span>
          )}
        </div>

        {/* Download App Section */}
        <div className="flex flex-col items-center lg:items-start max-w-md">
          <div className="bg-[#EDEDED] p-3 flex flex-col lg:flex-row justify-between items-center border rounded-xl space-y-3 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-[#262626] text-xl font-normal font-work-sans">
                Download for a better experience
              </h1>
              <button
                id="download_btn_navbar"
                className="bg-black hover:bg-gray-600 text-white py-1 px-4 mt-2 rounded-sm"
              >
                Download App
              </button>
            </div>
            <img
              width="100"
              src="https://probo.in/_next/image?url=%2Fassets%2Fimages%2Fevents%2Fimages%2Fdownload.png&w=256&q=75"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* All Events Section */}
      <div className="max-w-xl">
        <h2 className="font-semibold font-work-sans border-b-2 pb-2">
          All Events
        </h2>
        {sotckData && sotckData.length >= 2 ? (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {sotckData && sotckData.length > 1 ? (
              sotckData
                .slice(1)
                .map((data, index) => <ScrollCard key={index} data={data} />)
            ) : (
              <span>No additional events available</span>
            )}
          </div>
        ) : (
          <span>No additional events available</span>
        )}
      </div>
    </section>
  );
}
