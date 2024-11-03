import { useState } from "react"
import { Bichar } from "./Bichar"
import Box from "./Box"
import { Care } from "./Care"
import Download from "./Download"
import Footer from "./Footer"
import { Hero } from "./Hero"
import Navbar from "./Navbar"
import Nazar from "./Nazar"
import { Slider } from "./Slider"
import { Modal } from "./Model"

// 2. Modify your Home component
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
