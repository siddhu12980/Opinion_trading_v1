import { GoArrowRight } from "react-icons/go";
const Box = () => {
  return (
    <div className="grid grid-cols-5 gap-4  border-t-[50px] border-slate-100 border-opacity-10 ">

      <div className="text-5xl flex flex-col bg-slate-200 gap-8 col-span-1 p-8 ">
        <p>What's</p>
        <p>New in</p>
        <p>Probo</p>
        <div className="flex  justify-between">
          <div></div>
          <GoArrowRight size={52} className="" />
        </div>
      </div>


      <div className="col-span-2 bg-black text-white text-left flex flex-col gap-2 p-8 justify-between font-bold" >

        <div className="flex flex-col gap-2">
          <div className="text-3xl">Probo Cares</div>
          <div className="text-sm font-normal w-[60%]">Be it loss protection or data security, Probo is user first always. Check out the latest on responsible trading.</div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-2 p-2 pt-3">
            Read more
            <GoArrowRight size={22} />
          </div>

          <div className="relative ">
            <img src="./cares.webp" alt="cares" height={200} width={200} />
          </div>
        </div>


      </div>



      <div className="col-span-2 bg-black text-white text-left flex flex-col gap-2 p-8 justify-between font-bold" >

        <div className="flex flex-col gap-2">
          <div className="text-3xl">Probo Cares</div>
          <div className="text-sm font-normal w-[60%]">Be it loss protection or data security, Probo is user first always. Check out the latest on responsible trading.</div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-2 p-2 pt-3">
            Read more
            <GoArrowRight size={22} />
          </div>

          <div className="relative ">
            <img src="./cares.webp" alt="cares" height={200} width={200} />
          </div>
        </div>


      </div>




      <div className="col-span-4 bg-black text-white text-left flex flex-col gap-2 p-8 justify-between font-bold" >
        <div className="flex flex-col gap-2">
          <div className="text-3xl">Probo Cares</div>
          <div className="text-sm font-normal w-[60%]">
            Market orders are a fast and reliable method to buy or exit a trade in a fast-moving market. With market orders, quantities are matched almost instantly after placing an order at the best available price. Come test drive.</div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-2 p-2 pt-3">
            Read more
            <GoArrowRight size={22} />
          </div>

          <div className="relative ">
            <img src="./cares.webp" alt="cares" height={250} width={250} />
          </div>
        </div>
      </div>


      <div className="col-span-1 bg-black text-white text-left flex flex-col gap-2 p-8 justify-between font-bold" >

        <div className="flex flex-col gap-2">
          <div className="text-2xl">
            The Power of Prediction Markets
          </div>
          <div className="text-sm font-normal w-[90%]">Check out case studies, research articles and the utility of Probo events</div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex gap-2 p-2 pt-3">
            Read more
            <GoArrowRight size={22} />
          </div>

          <div className="relative ">
            <img src="./cares.webp" alt="cares" height={150} width={150} />
          </div>
        </div>
      </div>




    </div >
  )
}

export default Box
