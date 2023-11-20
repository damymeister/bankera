import '@/components/css/home.css';
import '@/components/css/dashboard.css';
import '@/components/css/post.css';

import { useState } from 'react';
import  Link  from 'next/link';
import { usePathname } from 'next/navigation';
import {FaHome, FaEdit, FaUser , FaExchangeAlt, FaWallet, FaDeezer}  from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
export default function SidePanel() {
    const [isUsersExpanded, setIsUsersExpanded] = useState(false);


    const toggleUsersSection = () => {
      setIsUsersExpanded(!isUsersExpanded);
    };
    const [isSidebarHidden, setIsSidebarHidden] = useState(true);

    const toggleSidebar = () => {
      setIsSidebarHidden(!isSidebarHidden);
    };
  

    const currentRoute = usePathname();

    const isActive = (route: string | null) => {
        return currentRoute === route ? 'bg-[#1f1b24b2] p-3 rounded-lg text-[#BB86FC] shadow-2xl ' : 'hover:bg-[#1f1b24b2] hover:p-2 hover:rounded-lg hover:text-[#BB86FC] ease-in duration-200';
      };

    return (

      <div
      className={`side-panel absolute z9 flex flex-col flex-shrink-0 bgdark border-r borderLight p-0 ${
        isSidebarHidden ? ' opacity-75 w-16 h-16 button4 fixed left-0 rounded-r-full' : 'w-80 ease-in duration-500'
      }`}
    >
      <div className="flex items-center h-16 fixed left-0">
        <span className={`text-lg font-bold text-white p-3 ${isSidebarHidden ? 'hidden' : ''}`}>Kokpit</span>
        <div className="p-0 w-16">
          <button
            className={`h-16 w-16 flex items-center justify-center text-white  ${
              isSidebarHidden ? '' : 'rounded-r-full'
            }`}
            onClick={toggleSidebar}
          >
            {isSidebarHidden ? (
              <svg
                className="w-5 h-5  justify-right"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
      {!isSidebarHidden && (
        <nav className="flex flex-col flex-grow p-4 borderLightY pt-16">
          <div className='textOverline'></div>
          <Link href="/user/dashboard" className={`flex items-center space-x-2 py-2  ${isActive('/user/dashboard')}`}>
            <FaHome />
            <span>Kokpit</span>
          </Link>
          <Link href="/news" className={`flex items-center space-x-2 py-2 ${isActive('/news')}`}>
            <FaEdit />
            <span>Posts</span>
          </Link>
          <Link href="/exchangeRates" className={`flex items-center space-x-2 py-2 ${isActive('/exchangeRates')}`}>
            <FaDeezer />
            <span>Kursy walut</span>
          </Link>
          <Link href="/user/currencyExchange" className={`flex items-center space-x-2 py-2 ${isActive('/user/currencyExchange')}`}>
            <FaExchangeAlt />
            <span>Wymiana walut</span>
          </Link>
          <Link href="/user/wallet" className={`flex items-center space-x-2 py-2 ${isActive('/user/wallet')}`}>
            <FaWallet />
            <span>Portfel</span>
          </Link>
          <Link href="/user/usersTransactions" className={`flex items-center space-x-2 py-2 ${isActive('/user/usersTransactions')}`}>
            <FaMoneyBillTransfer />
            <span>Przelewy</span>
          </Link>
          <div className="relative">
            <input type="checkbox" id="users-dropdown" className="hidden" />
            <label
              htmlFor="users-dropdown"
              className={`flex items-center space-x-2 py-2 cursor-pointer ${isActive('/exchangeRates')}`}
              onClick={toggleUsersSection}
            >
              <FaUser />
              <span>Kursy walut</span>
              <svg
                className={`w-4 h-4 ml-auto ${isUsersExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </label>
            {isUsersExpanded && (
              <div className="pl-6">
                <Link href="/users/create" className={`flex items-center space-x-2 py-2 ${isActive('/exchangeRates')}`}>
                  <span>Create User</span>
                </Link>
                <Link href="/users/manage" className={`flex items-center space-x-2 py-2 ${isActive('/exchangeRates')}`}>
                  <span>Manage Users</span>
                </Link>
              </div>
            )}
          </div>
          <Link href="/exchangeRates" className={`flex items-center space-x-2 py-2 ${isActive('/exchangeRates')}`}>
            <FaEdit />
            <span>Kursy walut</span>
          </Link>
          <Link href="/exchangeRates" className={`flex items-center space-x-2 py-2 ${isActive('/exchangeRates')}`}>
            <FaEdit />
            <span>Kursy walut</span>
          </Link>
        </nav>
      )}
    </div>
    )
}