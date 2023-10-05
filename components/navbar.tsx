"use client";
import '@/components/css/home.css';
import '@/components/css/home.css';
import '@/components/css/navbar.css';

import  Link  from 'next/link';
import { FaGreaterThan} from "react-icons/fa";
import { usePathname } from 'next/navigation';

import React from "react";

export default function Navbar(){

  const currentRoute = usePathname();

  const isActive = (route: string | null) => {
      return currentRoute === route ? 'currentlyOn' : '';
    };
  

    return(
       
      <div className="headerNav">
        <div className="logo mx-5 px-5">
          <a href="/" className={`flex items-center space-x-2 py-5 text-gray-300 pl-2 ${isActive('/')}`}>Bankera.pL</a>
        </div>
        <div className="linksN text-right">
          <div className="navlinks mx-5 text ">
            <Link href="/about" className={` ${isActive('/about')}`}>About</Link>
            <Link href="/help" className={` ${isActive('/help')}`}>Help</Link>
            <Link href="/contact" className={` ${isActive('/contact')}`}>Contact</Link>
          </div>
          <div className="menuNav mx-3 py-5">
            <Link href="/dashboard" className={` ${isActive('/dashboard')}`}>dashboard</Link>
            <Link href="/services" className={` ${isActive('/services')}`}>Services</Link>
            <Link href="/news" className={`${isActive('/news')}`}>News</Link>
            <Link href="/wallet" className={`${isActive('/wallet')}`}>Wallet</Link>
            <Link href="/login" className={`${isActive('/login')}`}>Zaloguj</Link>
            <Link href="/register" className="">Zarejestruj</Link>
          </div>
        </div>
    </div>
        
    )
}
