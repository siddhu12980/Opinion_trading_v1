import { motion, AnimatePresence } from "framer-motion";
import SignIn from "./SignIn";
import Signup from "./Signup";
import { useEffect, useId } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../Store/atom";
import { useNavigate } from "react-router-dom";

export const Modal = ({ isOpen, onClose, mode }: any) => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);
  console.log(user);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleSignInSuccess = async (userId: string) => {

    console.log("User signed in");

    await localStorage.setItem("userId", userId);
    setUser((prev) => ({ ...prev, userId: userId }));


    navigate("/trade");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white bg-opacity-5  h-screen  p-6 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal content */}
            <div className="flex justify-between   mt-5 ">
              <div className="bg-slate-100 px-4  rounded-lg w-[400px] mx-auto">
                <div className="flex  justify-end mb-4  pt-4 ">
                  <button onClick={onClose}>X</button>
                </div>
                {mode === "signin" ? (
                  <SignIn onSuccess={handleSignInSuccess} />
                ) : (
                  <Signup onSuccess={handleSignInSuccess} />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
