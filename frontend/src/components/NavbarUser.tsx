import { CgProfile } from "react-icons/cg";
import { FaWallet } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { PiSuitcaseSimpleLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const NavbarUser = ({ balance }: { balance: number }) => {

    const nagivate = useNavigate()
    return (
        <div className="flex justify-between w-full border-slate-200 border-b-2 pb-3">
            <div className="flex justify-between space-x-8">
                <div className=" cursor-pointer" onClick={() => { window.location.href = ("/") }}>
                    <img src="./logo.avif" />
                </div>
                <div className=" flex space-x-8 text-xl">

                </div>
            </div>

            <div className="flex gap-4">
                <IoMdHome size={28} className=" cursor-pointer" onClick={() => { nagivate("/trade") }} />
                <PiSuitcaseSimpleLight size={28} />
                <div className="flex px-2 py-2 border  justify-between gap-5  border-opacity-45 border-t-gray-400 border-double">
                    <FaWallet size={18} />
                    <div className=" text-xs">{balance}</div>
                </div>

                <CgProfile size={32} />

            </div>
        </div>
    )
}

export default NavbarUser

