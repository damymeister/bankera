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
            <div className=" py1 my1 anim3">
            <h1 className='py1'>O nas</h1>
            <h4 className='py1 '>Projekt został zrealizowany przez:</h4>
            <div className="contact">
            <a>Mateusz Adamczyk</a>
            <a>Jakub Baran</a>
            <a>Marcin Basak</a>
            
            
            </div>
            </div>
        </div>
        </Layout>  
    )
}