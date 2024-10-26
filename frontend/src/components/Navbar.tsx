
const Navbar = () => {
  return (
    <div className="flex justify-between w-full border-slate-200 border-b-2 pb-3">
      <div className="flex justify-between space-x-8">
        <div>
          <img src="./logo.avif" />
        </div>
        <div className=" flex space-x-8 text-xl">
          <div>Trading</div>
          <div>Team11</div>
          <div>Read</div>
          <div>Cares</div>
          <div>Careers</div>
        </div>
      </div>

      <div className="flex gap-2">
        <p className="text-xs p-2 text-right ">
          For 18 years and<br /> above only
        </p>
        <div> <button className=" px-5 py-2 border-black bg-white  border-2">Download App</button> </div>
        <div> <button className="px-5 py-2 border-black border-2  bg-black text-white">Trade Online</button> </div>
      </div>
    </div>
  )
}

export default Navbar
