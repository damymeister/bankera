"use client";

import '@/components/css/home.css';
import '@/components/css/navbar.css';

import  Link  from 'next/link';
import { FaGreaterThan} from "react-icons/fa";
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from "react";
import api_url from '@/lib/api_url';
import axios from 'axios';
import { deleteCookie } from 'cookies-next';

export default function Navbar(){

  const [privilege, setPrivilege] = useState(0);
  const currentRoute = usePathname();

  useEffect (() => {
    // Get Privilege
    const handleGetPrivilege = async () => {
        try {
            const url = api_url('privilege')
            const { data } = await axios.get(url, {headers: {Accept: 'application/json'}})
            setPrivilege(parseInt(data.privilege))
        } catch (error) {
            console.log('unexpected error: ', error)
        }
    }
    handleGetPrivilege()
  }, [])

  const handleLogout = async () => {
    deleteCookie('token')
    window.location.reload()
  }

  const isActive = (route: string | null) => {
      return currentRoute === route ? 'currentlyOn' : '';
    };
  
    return (
      <div className="headerNav">
        <div className="logo mx-5 px-5">
          <a href="/" className={`flex items-center space-x-2 py-5 text-gray-300 pl-2 ${isActive('/')}`}>Bankera.pL</a>
        </div>
        <div className="linksN textRight">
          <div className="navlinks mx-5 text ">
            <Link href="/about" className={` ${isActive('/about')}`}>About</Link>
            <Link href="/help" className={` ${isActive('/help')}`}>Help</Link>
            <Link href="/contact" className={` ${isActive('/contact')}`}>Contact</Link>
          </div>
          <div className="menuNav mx-3 py-5">
            { privilege === 3 && <Link href="/admin/adminPanel" className="">Admin</Link> }
            { privilege > 0 && <Link href="/dashboard" className={` ${isActive('/dashboard')}`}>Dashboard</Link> }
            { privilege > 0 &&<Link href="/services" className={` ${isActive('/services')}`}>Services</Link> }
            <Link href="/news" className={`${isActive('/news')}`}>News</Link>
            { privilege > 0 && <Link href="/profile" className={`${isActive('/profile')}`}>Profil</Link> }
            
            { privilege > 0 && <Link href="/wallet" className={`${isActive('/wallet')}`}>Wallet</Link> }
            { privilege === 0 && <Link href="/login" className={`${isActive('/login')}`}>Zaloguj</Link> }
            { privilege === 0 && <Link href="/register" className="">Zarejestruj</Link>}
            { privilege > 0 && <Link href="/" onClick={handleLogout}>Logout</Link> }
           
          </div>
        </div>
      </div>
    )
}
