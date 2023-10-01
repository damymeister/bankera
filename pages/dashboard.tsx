import '../components/css/home.css';
import '../components/css/dashboard.css';
import '../components/css/post.css';
import '@/components/css/tailwind.css';
import SidePanel from'@/components/sidepanel';
import { useState } from 'react';
import Layout from '@/app/layoutPattern';
import {FaHome, FaEdit, FaUser , FaExchangeAlt}  from "react-icons/fa";
export default function Dashboard() {
    const [isUsersExpanded, setIsUsersExpanded] = useState(false);

    const toggleUsersSection = () => {
      setIsUsersExpanded(!isUsersExpanded);
    };
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarHidden(!isSidebarHidden);
    };

    return (
    <Layout>
        <div className="flex  md:min-h-screen w-full">
        <SidePanel></SidePanel>
        <div className="container bgdark borderLightY p0 h-3/5 ">
            <div className="dashboard py1 my1 ">
            <div className="dashboardBody px1">
                <div className="dashboardPanel">Zajebisty panel boczny</div>
                <div className="dashboardContent textCenter">
                    <div className=''>Pulpit</div>
                    <div className=''>Witaj @UserName</div>
                </div>
                
            </div>
            </div>
        </div>

       
        </div>
        </Layout>
    )
}