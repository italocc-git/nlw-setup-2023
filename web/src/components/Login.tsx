import { useAuth0 } from '@auth0/auth0-react'
import LogoImage from '../assets/logo.svg'
export const Login = () => {
    const {loginWithRedirect } = useAuth0()
    return (
        <div className=" px-6 flex flex-col gap-16">
          <img className='' src={LogoImage} alt="" />
          <button className='bg-transparent border border-violet-500 hover:border-violet-300
       transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background' onClick={() => loginWithRedirect()}>Logar</button>
        </div>
        
      )
}