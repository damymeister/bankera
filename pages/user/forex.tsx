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
    
      

    return (
        <Layout>
        <div className="h-full">
            <SidePanel></SidePanel>
            <div className="bgdark borderLightY p-0 justify-center text-center my-10">
            
              <ChartExample />
                <div className='forexPanel'>

                </div>
            </div>  
        </div>
        </Layout>
    )
}