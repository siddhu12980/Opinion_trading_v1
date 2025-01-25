import { motion, AnimatePresence } from "framer-motion";
import SignIn from "./SignIn";
import Signup from "./Signup";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userIdSelector } from "../../Store/atom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HTTP_SERVER_URL } from "../../constants/const";
import GiftModel from "../Account/GiftModel";
import { toast } from "sonner";

export const Modal = ({ isOpen, onClose, mode }: any) => {
  const navigate = useNavigate();

  const [userId, setUserId] = useRecoilState(userIdSelector);
  const [showModal, setShowModal] = useState(false);

  console.log("modal", userId);

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

  const handleSignInSuccess = async (userId1: string) => {
    await new Promise((resolve) => {
      setUserId(userId1);
      resolve(true);
    });

    navigate("/trade");
  };

  const handleSignupSuccess = async (userId1: string) => {
    await new Promise((resolve) => {
      setUserId(userId1);
      resolve(true);
    });

    //add moeny to the account

    try {
      const res = await axios.post(`${HTTP_SERVER_URL}/onramp/inr`, {
        userId: userId1,
        amount: 100000,
      });

      console.log(res);

      if (res.status !== 200) {
        console.log("error");
        return;
      }

      //show added balance in the account model
      onClose();
      setShowModal(true);

      const CreatingPromise = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setShowModal(false);
            resolve(true);
          }, 3000);
        });
      };

      await CreatingPromise();

      navigate("/trade");
    } catch (e) {
      console.log(e);
      toast.error("Error adding balance to the account");
    }
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
                  <SignIn
                    onSuccess={(userId: string) => {
                      handleSignInSuccess(userId);
                    }}
                  />
                ) : (
                  <Signup
                    onSuccess={(userId: string) => {
                      handleSignupSuccess(userId);
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={() => {
            setShowModal(false);
          }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white bg-opacity-5  h-screen  p-6 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(false);
            }}
          >
            {/* Modal content */}
            <div className="flex justify-between   mt-5 ">
              <div className="bg-slate-100 px-4  rounded-lg w-[400px] mx-auto">
                {<GiftModel amount={100000} />}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
