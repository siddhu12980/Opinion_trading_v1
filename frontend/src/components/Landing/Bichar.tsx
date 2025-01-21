import { useState } from "react";

interface Datas {
  title: string;
  description: string;
  data: string;
}

const datass: Datas[] = [
  {
    title: "Samachar",
    description: "Be in the know",
    data: "Build your knowledge and form your opinions and views about upcoming events in the world.",
  },
  {
    title: "Vichar",
    description: "Use what you know",
    data: "Build your knowledge and form your opinions and views about upcoming events in the world",
  },
  {
    title: "Vypar",
    description: "Trade and grow",
    data: "Invest in your opinions about future events and use your knowledge to trade & benefit.",
  },
];

export const Bichar = () => {
  const [index, setIndex] = useState(0)
  return (
    <div className="flex w-full bg-slate-800 p-5 h-full text-white justify-around">
      <div className="w-[60%] text-left flex flex-col gap-8 ">

        <div className="flex gap-4 ">
          {datass.map((d, i) => {
            return <div key={i} onClick={() => setIndex(i)} className={`text-5xl cursor-pointer ${i == index ? `text-white` : `text-slate-400 text-opacity-50`} `} >
              {d.title}
            </div>
          })}
        </div>
        <div className="text-3xl">
          {datass[index].description}
        </div>
        <div className="text-3xl w-[70%]">
          {datass[index].data}
        </div>

      </div>

      <div className="flex justify-center items-center flex-1 mt-6 lg:mt-0">
        <div className="bg-white w-[180px] md:w-[200px] lg:w-[240px] h-[300px] md:h-[380px] rounded-3xl shadow-lg border-4 border-gray-700 overflow-hidden flex items-center justify-center">
          <video
            className="rounded-xl"
            muted
            loop
            autoPlay
            height="100%"
            width="100%"
            src="https://probo.in/assets/videos/info-video.mp4"
          ></video>
        </div>
      </div>
    </div >
  );
};
