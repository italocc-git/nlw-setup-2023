import { Spinner } from "phosphor-react";
import LogoImage from '../assets/logo.svg'
export function Loading() {
    return(
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-12">
        
        <img className='' src={LogoImage} alt="" />
        <span className='text-3xl font-bold'>Carregando ...</span>
        <Spinner className="w-12 h-12 animate-spin"  />
      </div>
    )
}