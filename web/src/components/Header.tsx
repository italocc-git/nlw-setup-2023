import LogoImage from '../assets/logo.svg'
import { Plus, X } from "phosphor-react";
import * as Dialog from '@radix-ui/react-dialog';

import { NewHabitForm } from "./NewHabitForm";
import {useAuth0} from '@auth0/auth0-react'
export function Header() {
  const {user,logout} = useAuth0()
  
  return (
    <>
    {user && (
      <div className='w-full max-w-3xl mx-auto flex items-center justify-end gap-6'>
      <div className=' flex  items-center gap-2'>
        <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full"/>
        <div className='text-xs flex flex-col justify-between gap-1'>
          <h2>Bem vindo, {user.given_name}</h2>
          <p> {user.email && `E-mail : ${user.email}`}</p>
        </div>
      </div>
      <button onClick={() => logout()} className='bg-transparent border border-violet-500 hover:border-violet-300
       transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background'>Sair</button>
    </div>
    )}

    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img className='' src={LogoImage} alt="" />
      
      <Dialog.Root>
        <Dialog.Trigger
          type="button"
          className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300
          transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background"
        >
          <Plus size={20} className="text-violet-500" />
          Novo hábito
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />

          <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Dialog.Close className="absolute right-6 top-6 rounded-lg text-zinc-400 hover:text-zinc-200  focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900">
              <X size={24} aria-label="Fechar"  />
            </Dialog.Close>

            <Dialog.Title className="text-3xl leading-tight font-extrabold">
              Criar bábito
            </Dialog.Title>

            <NewHabitForm />
          </Dialog.Content>
        </Dialog.Portal>

      </Dialog.Root>
    </div>
    </>
  );
}