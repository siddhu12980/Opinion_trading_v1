import './App.css'
import Navbar from './components/Navbar';
import AppRoutes from './routes/index.routes';
function App() {
  return (
    <div className='w-full'>
      <Navbar />
      <AppRoutes />
    </div>
  )
}

export default App
