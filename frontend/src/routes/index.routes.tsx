import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from '../components/Home'
import { Trade } from '../components/Trade'
import TradeScreen from '../components/TradeScreen'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path="/trade" element={<Trade/>} />
        <Route path='/order' element={<TradeScreen/>} />

      </Routes>
    </Router>
  )
}

export default AppRoutes
