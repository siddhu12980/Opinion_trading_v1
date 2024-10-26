import { FaArrowRight } from "react-icons/fa"

const Download = () => {
  return (
    <div className="w-full bg-black text-white flex flex-col p-8 pb-0">
      <div className="flex flex-col  gap-8">
        <div className="text-6xl tracking-wide">
          <p>What will be the return </p>
          <p> on your opinions?</p>
        </div>


        <div className="px-6 py-3 border-2 w-[40%] rounded-3xl mx-auto border-white flex justify-center items-center text-white">
          <p className="flex items-center gap-2 text-2xl">
            Download <FaArrowRight />
          </p>
        </div>

      </div>

      <div className="flex justify-between " >
        <div> <img src="./personl.avif" /> </div>

        <div> <img src="./personr.avif" /> </div>
      </div>

    </div>
  )
}

export default Download
