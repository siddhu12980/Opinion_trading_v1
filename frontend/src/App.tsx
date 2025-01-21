import { RecoilRoot } from 'recoil';
import './App.css'
import AppRoutes from './routes/index.routes';
import { QueryClient, QueryClientProvider } from 'react-query';
export const queryClient = new QueryClient()
import { Toaster } from 'sonner'
function App() {
  return (
    <div className='w-full'>

      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <AppRoutes />
          <Toaster />
          
        </RecoilRoot>
      </QueryClientProvider>
    </div>
  )
}

export default App
