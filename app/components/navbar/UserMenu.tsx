'use client';

import { AiOutlineMenu } from 'react-icons/ai';
import Avatar from '../Avatar';
import { useState, useCallback, useEffect, useRef } from 'react';
import MenuItem from './MenuItem';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRentModal from '@/app/hooks/useRentModal';
import { SafeUser } from '@/app/types';

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({
  currentUser,
}) => {
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal();
  const rentModal = useRentModal()
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

 

  let menuRef = useRef<HTMLDivElement>(null);
 
   useEffect(() => {
    let handler = (e: Event) => {
      if(!menuRef.current?.contains(e.target as Node)){
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };

   });

  const logout = () => {
     signOut();
     toast.success('You have been logged out');
  };


  const onRent = useCallback(() => {
    if (!currentUser) {
    return  loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  return (
    <div 
    ref={menuRef}
    className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Airbnb you home
        </div>
        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer
        hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image}/>
          </div>
        </div>
      </div>
      {isOpen && (
        <div 
        className="absolute rounded-xl shadow-lg w-[40vw] md:w-3/4 overflow-hidden right-0 top-14 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
               <>
               <MenuItem onClick={() => {}} label="My Trips" />
                 <MenuItem onClick={() => {}} label="My Favorites" />
                 <MenuItem onClick={() => {}} label="My Reservations" />
                 <MenuItem onClick={() => {}} label="My Properties" />
                 <MenuItem onClick={rentModal.onOpen} label="Airbnb my home" />
                 <MenuItem onClick={() => {}} label="My Favorites" />
                 <hr/>
                 <MenuItem onClick={() => logout()} label="Logout" />
               </>
            ) : (
              <>
              <MenuItem onClick={loginModal.onOpen} label="Login" />
                <MenuItem onClick={registerModal.onOpen} label="Sign Up" />
              </>
            )}
           
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
