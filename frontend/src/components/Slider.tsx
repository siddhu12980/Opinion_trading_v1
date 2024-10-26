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
            <SlideCard />
            <SlideCard />
            <SlideCard />
            <SlideCard />
            <SlideCard />
          </div>


        </div>

      </div>
    </>
  )
}

