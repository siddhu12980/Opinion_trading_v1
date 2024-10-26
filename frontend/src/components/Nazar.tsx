import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
const gridData = [
  {
    id: 1,
    image: "./nazar.avif",
    title: "Nazar",
    description:
      "Keep an eye on the happenings around you. Be it Politics, Sports, Entertainment, and more.",
  },
  {
    id: 2,
    image: "./nazar.avif",
    title: "Khabar",
    description:
      "Understand the news without the noise. Get to the crux of every matter and develop an opinion.",
  },
  {
    id: 3,
    image: "./nazar.avif",
    title: "Jigar",
    description:
      "Have the courage to stand by your opinions about upcoming world events by investing.",
  },
  {
    id: 4,
    image: "./nazar.avif",
    title: "Sabar",
    description:
      "Have the patience to negotiate market ups and downs, and take a decision as events unfold.",
  },
];
const Nazar = () => {
  return (
    <div className="text-6xl p-9 flex flex-col gap-5 bg-slate-100">
      <div className="items-center flex ">
        <div className="w-[80%] flex">
          <FaQuoteLeft />
          News that creates trading
        </div>
        <div className="w-[20%]"></div>
      </div>
      <div className="items-center flex">
        <div className="w-[40%]"></div>
        <div className="w-[60%] flex">opportunity, everyday <FaQuoteRight /></div>
      </div>

      <div className="text-xl grid grid-cols-4 gap-4">
        {gridData.map((item) => (
          <div key={item.id} className="relative w-full col-span-1">
            <img src={item.image} alt={item.title} />
            <div className="absolute -bottom-5 mx-auto flex flex-col gap-2 bg-slate-200 w-[80%] ml-[10%] p-2">
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nazar;
