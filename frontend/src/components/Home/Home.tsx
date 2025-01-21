import { useState } from "react"
import { Bichar } from "../Landing/Bichar"
import Box from "../Landing/Box"
import { Care } from "../Landing/Care"
import Download from "../Landing/Download"
import Footer from "./Footer"
import { Hero } from "./Hero"
import Navbar from "./Navbar"
import Nazar from "../Landing/Nazar"
import { Slider } from "../Landing/Slider"
import { Modal } from "../Auth/Model"

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openSignIn = () => {
    setAuthMode('signin');
    setIsModalOpen(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setIsModalOpen(true);
  };

  

  return (
    <>
      <Navbar onSignIn={openSignIn} onSignUp={openSignUp} />
      <Hero />
      <Bichar />
      <Slider />
      <Box />
      <Care />
      <Nazar />
      <Download />
      <Footer />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </>
  )
}


export default Home
