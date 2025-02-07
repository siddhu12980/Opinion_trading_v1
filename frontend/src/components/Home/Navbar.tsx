import { useNavigate } from "react-router-dom"

const Navbar = ({ onSignIn, onSignUp }:any) => {
  const nagivate = useNavigate()

  return (
    <div className="flex justify-between w-full border-slate-200 border-b-2 pb-3">
      <div className="flex justify-between space-x-8">
        <div className=" cursor-pointer" onClick={() => { 
          nagivate("/")
         }}>
          <img src="./logo.avif" />
        </div>
        <div className=" flex space-x-8 text-xl">
          <div className=" cursor-pointer">Trading</div>
          <div className=" cursor-pointer">Team11</div>
          <div className=" cursor-pointer">Read</div>
          <div className=" cursor-pointer">Cares</div>
          <div className=" cursor-pointer">Careers</div>
        </div>
      </div>

      <div className="flex gap-2">
        <p className="text-xs p-2 text-right ">
          For 18 years and<br /> above only
        </p>
        <div> <button onClick={onSignIn} className=" px-5 py-2 border-black bg-white  border-2">Signin</button> </div>
        <div> <button className="px-5 py-2 border-black border-2  bg-black text-white" onClick={onSignUp} >Signup</button> </div>
      </div>
    </div>
  )
}


export default Navbar
