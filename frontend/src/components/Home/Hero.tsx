
export const Hero = () => {
  return (
    <div className="relative w-full">
      <div className="flex w-full "
      >
        <div className=" flex flex-col w-[50%]  h-[700px]  justify-center  gap-12">
          <div className="text-7xl text-left  tracking-wider">
            Invest in your
            <p className="text-6xl"> pint of view</p>
          </div>

          <div className="text-xl text-slate-500 text-left">
            Sports, Entertainment, Economy or Finance.
          </div>
          <div className="flex gap-4">
            <button className=" px-5 py-2 border-black bg-white  border-2">Download App</button>
            <button className="px-5 py-2 border-black border-2  bg-black text-white">Trade Online</button>
          </div>



        </div>
        <div className="w-[50%]"><img src="./probodashboard.avif" /> </div>
      </div >


      <div className="absolute inset-x- bottom-24 -z-50">
        <img src="./header.svg" alt="Decoration" className="w-full opacity-50" />
      </div>
    </div >
  )
}

