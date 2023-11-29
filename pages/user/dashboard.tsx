import '@/components/css/home.css';
import '@/components/css/dashboard.css';
import '@/components/css/tailwind.css';
import SidePanel from'@/components/sidepanel';
import { useEffect, useState } from 'react';
import Layout from '@/app/layoutPattern';
import {FaHome, FaEdit, FaUser , FaExchangeAlt}  from "react-icons/fa";
import SnackBar from '@/components/snackbar'
import api_url from '@/lib/api_url';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import ChartExample from '@/components/newchart';
export default function Dashboard() {
    const [isUsersExpanded, setIsUsersExpanded] = useState(false);

    const toggleUsersSection = () => {
      setIsUsersExpanded(!isUsersExpanded);
    };
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarHidden(!isSidebarHidden);
    };


    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    
    const url = api_url('auth/user/profile')


    useEffect(() => {
        console.log(url);
      
        const GetProfile = async () => {
          try {
            const { data } = await axios.get(url, { headers: { Accept: 'application/json' } });
            return data;
          } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
          }
          
        };

        const fetchProfileData = async () => {
        const profileData = await GetProfile();

        setName(profileData.first_name)
        setSurname(profileData.last_name)

        };
      
        fetchProfileData();
      }, []);
      

    return (
        <Layout>
        <div className="h-full">
            <SidePanel></SidePanel>
            <div className="bgdark borderLightY p-0 flex justify-center text-center my-10">
            <div className="dashboard py-1 my-1">
                <div className="dashboardBody px-1 flex flex-col items-center">
                <div className="dashboardContent ">
                    <div className='text-xl'>Kokpit</div>
                    <div className='flex flex-row textUnderline p-2 m-2 text-2xl'> 
                        <div className='pr-2 '>Hello </div>
                        <div className='text-[#BB86FC]'>{name} {surname}</div>
                        <div className='pr-2 '>! </div>
                    </div>
                </div>
                <div className='mt-8'>
                Przejdź do portefla
                <div className='mt-8 mb-8'><Link href="/user/wallet" className="button2">Portfel</Link></div>
                </div>
               </div>
            </div>
            </div>
        </div>
        </Layout>
    )
}