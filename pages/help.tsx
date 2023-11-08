import '@/components/css/home.css';
import '@/components/css/contact.css';
import '@/components/css/post.css';
import '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import React from "react";

export default function About() {

    return (
        <Layout>
        <div className="containerCustom borderLightY">
            <div className="my1 ">
            
            <div className="contact">
                <h1 className='py1 textUnderline text-3xl'>Pomoc</h1>
                <h4 className=''>Chcesz zgłosić problem z naszą aplikacją?</h4>
                <h4 className='flex items-center text-xl'>Napisz do nas na adres na help@dingomc.net</h4>
            </div>
            </div>
        </div>
        </Layout>  
    )
}