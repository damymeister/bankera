import '@/components/css/home.css';
import '@/components/css/navbar.css';

import Link from 'next/link';
import { FaBars, FaGreaterThan, FaHome, FaLessThan } from "react-icons/fa";
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from "react";
import api_url from '@/lib/api_url';
import axios from 'axios';
import { deleteCookie } from 'cookies-next';

export default function Navbar() {
  const [privilege, setPrivilege] = useState(0);
  const currentRoute = usePathname();
  const [folded, setFolded] = useState(false);

  useEffect(() => {
    // Get Privilege
    const handleGetPrivilege = async () => {
      try {
        const url = api_url('privilege')
        const { data } = await axios.get(url, { headers: { Accept: 'application/json' } })
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

  const toggleFold = () => {
    setFolded(!folded);
  }

  useEffect(() => {
    const handleResize = () => {
      setFolded(window.innerWidth < 768);
    };

    // Add event listener to handle window resize
    window.addEventListener("resize", handleResize);

    // Call the handleResize function on initial render
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>

      <div className='bg-[#1a171e] w-full h-full flex flex-row items-right justify-end top-0 right-0'>
        <button className="foldButton text-3xl p-4" onClick={toggleFold}>
          {folded ? <FaBars /> : <FaHome />}
        </button>
      </div>

      <div className={`headerNav ${folded ? 'folded' : ''}`}>
        <div className="logo mx-5 px-5">
          <a href="/" className={`flex items-center space-x-2 py-5 text-gray-300 pl-2 ${isActive('/')}`}>Bankera.pL</a>
        </div>
        <div className="linksN textRight">
          <div className={`navlinks mx-5 text ${folded ? 'folded' : ''}`}>
            <Link href="/about" className={` ${isActive('/about')}`}>About</Link>
            <Link href="/help" className={` ${isActive('/help')}`}>Help</Link>
            <Link href="/contact" className={` ${isActive('/contact')}`}>Contact</Link>
          </div>
          <div className={`menuNav mx-3 py-5 ${folded ? 'folded' : ''}`}>
            {privilege === 3 && <Link href="/admin/adminPanel" className="admin">Admin</Link>}
            {privilege > 0 && <Link href="/user/dashboard" className={` ${isActive('/user/dashboard')}`}>Dashboard</Link>}
            {/* { privilege > 0 &&<Link href="/currencyExchange" className={` ${isActive('/currencyExchange')}`}>Currency Exchange</Link> } */}
            <Link href="/news" className={`${isActive('/news')}`}>News</Link>
            {privilege > 0 && <Link href="/user/profile" className={`${isActive('/user/profile')}`}>Profil</Link>}

            {/* { privilege > 0 && <Link href="/wallet" className={`${isActive('/wallet')}`}>Wallet</Link> } */}
            {privilege === 0 && <Link href="/login" className={`${isActive('/login')}`}>Zaloguj</Link>}
            {privilege === 0 && <Link href="/register" className="">Zarejestruj</Link>}
            {privilege > 0 && <Link href="/" onClick={handleLogout}>Logout</Link>}

          </div>
        </div>
      </div>


      
    </>
  )
}