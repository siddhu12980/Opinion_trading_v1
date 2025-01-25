import { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaWallet } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { BiRupee } from "react-icons/bi";
import { userState } from "../../Store/atom";

const NavbarUser = () => {



  const [user ,setUser] = useRecoilState(userState)

  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    setUser({
      userId: "",
      balance: {
        freeBalances: 0,
        lockedBalances: 0,
      },
      stock: {},
    });
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between w-full border-slate-200 border-b-2 pb-3">
      <div className="flex justify-between space-x-8">
        <div className="cursor-pointer" onClick={() => navigate("/trade")}>
          <img src="/logo.avif" alt="Logo" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <IoMdHome
          size={28}
          className="cursor-pointer hover:text-gray-600 transition-colors"
          onClick={() => navigate("/trade")}
        />

        <div className="flex px-2 py-2 border justify-between gap-5 border-opacity-45 border-t-gray-400 border-double cursor-pointer hover:bg-gray-50 transition-colors">
          <FaWallet
            size={18}
            onClick={() => (navigate("/account"), console.log("clicked"))}
          />
          <div className="  flex gap-2 " >
            <BiRupee size={22} /> {user.balance.freeBalances}
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="cursor-pointer hover:text-gray-600 transition-colors"
          >
            <CgProfile size={32} />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 animate-[fadeIn_0.2s_ease-in-out]">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <IoLogOutOutline size={18} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarUser;
