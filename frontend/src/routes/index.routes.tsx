import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from '../components/Home'
import { Trade } from '../components/Trade'
import TradeScreen from '../components/TradeScreen'
import Account from '../components/Account'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trade" element={<Trade />} />
        <Route path='/order/:id' element={<TradeScreen />} />
        <Route path='/account' element={<Account />} />

      </Routes>
    </Router>
  )
}

export default AppRoutes
