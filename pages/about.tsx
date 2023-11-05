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
            <h1 className='py1 textUnderline text-3xl'>O nas:</h1>
            <h4 className=''>Projekt został zrealizowany przez:</h4>
                <a>Mateusz Adamczyk</a>
                <a>Jakub Baran</a>
                <a>Marcin Basak</a>
                <h2 className='textUnderline  text-3xl'>Co możesz robić na naszej stronie?</h2>
                <div className='flex flex-row '>
                    <h4 className='flex items-center text-xl'>Nasza strona oferuje:</h4>
                    <div className='px-8 flex flex-col items-start justify-center'>
                        <a className='py-1'>Możliwość wymiany walut</a>
                        <a className='py-1'>Dokonywanie transakcji z innymi użytkownikami</a>
                        <a className='py-1'>Dokonywanie spekulacji na rynku forex</a>
                        <a className='py-1'>Śledzenie aktualnych kursów walut</a>
                        <a className='py-1'>Przeglądania najnowszych informacji o stanie walut</a>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </Layout>  
    )
}