import './styles/global.css'
import './lib/dayjs'

import { Header } from "./components/Header";
import { SummaryTable } from "./components/SummaryTable";
import {useAuth0} from '@auth0/auth0-react'
import { Loading } from './components/Loading';
import { Login } from './components/Login';
import { atom , Provider} from 'jotai'
import { ToastProvider } from 'react-toast-notifications';


export const refreshAtom = atom(false)
function App() {
  const {isAuthenticated , isLoading} = useAuth0()

   if(isLoading) {
    return (
      <Loading/>
    )
  } 
  return (
    <div className="w-screen h-screen flex justify-center items-center  ">
      {isAuthenticated ? (
        <Provider>
          <ToastProvider >
            <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
              <Header />
              <SummaryTable />
            </div>
            
          </ToastProvider>
        </Provider>
      ): (
        <Login/>
      )}
    </div>
  )
}

export default App
