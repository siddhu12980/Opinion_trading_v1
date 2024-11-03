import SlideCard from "./SlideCard"

export const Slider = () => {
  return (
    <>
      <div className="flex  w-full">
        <div className="flex items-center justify-start flex-grow flex-shrink-0 w-1/3">

          <h1 className="text-6xl max-w-[1/4] font-bold text-gray-800 text-left">
            Trade when <br /> you like ,{" "}<br />
            <span className="text-4xl">on what you like</span>
          </h1>
        </div>

        <div className="relative flex-grow flex-shrink-0 overflow-y-auto z-10 w-1/3  h-[600px]   no-scrollbar ">
          <div className="hidden md:grid grid-cols-2 gap-4 p-4">
            <SlideCard title="Will Max Win Sau SauPalo" orders={1212} />
            <SlideCard title="Bitcoin to cross $12333" orders={5431}/>
            <SlideCard title="Argentina to win World Cup" orders={212}/>
            <SlideCard title="Tax rates to be decreased by 10% in next financial Year in India for Personal Income" orders={999}/>
            <SlideCard title="Tax rates to be increased in Ev " orders={223} />
          </div>


        </div>

      </div>
    </>
  )
}

