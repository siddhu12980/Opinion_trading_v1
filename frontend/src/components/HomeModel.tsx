import React, { useState } from 'react';
import {Modal} from './Model';
import SignIn from './SignIn';
import Signup from './Signup';
import { Home } from 'lucide-react';

const HomeModel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignin, setIsSignin] = useState(true); // Toggle between Signin and Signup

  const openModal = (signin: boolean) => {
    setIsSignin(signin);
    setIsModalOpen(true);
  };

  return (
    <div>
   
      <Home />

      <div className="fixed top-4 right-4 space-x-2">
        <button onClick={() => openModal(true)}>Sign In</button>
        <button onClick={() => openModal(false)}>Sign Up</button>
      </div>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isSignin ? <SignIn /> : <Signup />}
      </Modal>

    </div>
  );
};

export default HomeModel;
