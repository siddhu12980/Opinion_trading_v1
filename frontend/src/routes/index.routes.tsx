import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "../components/Home/Home";
import TradeScreen from "../components/Order/TradeScreen";
import Account from "../components/Account/Account";
import { Trade } from "../components/Home/Trade";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/order/:id" element={<TradeScreen />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
