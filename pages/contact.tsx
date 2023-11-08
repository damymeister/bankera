import '@/components/css/home.css';
import '@/components/css/contact.css';
import '@/components/css/post.css';
import React from "react";
import Layout from '@/app/layoutPattern';
import '@/app/globals.css';
import { BsTelephone } from "react-icons/bs";
import { SiSkypeforbusiness } from "react-icons/si";
import { MdOutlineMail } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";

export default function Contact() {

    return (
        <Layout>
            <div className="containerCustom borderLightY">
                <div className=" py1 my1">
                <h1 className='py1 textUnderline text-3xl mb-2'>Kontakt dla klientów</h1>
                <div className='flex flex-row gap-2 items-center justify-center flex-wrap'>
                    <AiOutlineCheck className='text-white'></AiOutlineCheck>
                    <div>
                        <h4 className='mt-4 mb-4'>Obsługa w języku polskim i angielskim w godzinach <b>8:00-23:00</b> (UTC+1) <b>od poniedziałku do piątku</b> w dni robocze w Polsce. <b>Karty wielowalutowe</b> obsługujemy 24/7.</h4>
                    </div>
                </div>
                <div className="justify-center items-center gap-4 flex flex-row flex-wrap mt-4 mb-4">
                    <div className='contactCard p1 justify-center'>
                        <div className='flex flex-row flex-wrap gap-2 justify-center items-center'>
                            <MdOutlineMail></MdOutlineMail>
                            <div className='email bold'>Napisz wiadomość</div>
                        </div>
                        <div className='email'>kontakt@bankera.pl</div>
                    </div>
                    <div className='contactCard p1 justify-center'>
                        <div className='flex flex-row flex-wrap gap-2 justify-center items-center'>
                            <BsTelephone></BsTelephone>
                            <div className='email bold'>Zadzwoń do nas</div>
                        </div>
                        <div className='email'>+48 663 968 203</div>
                    </div>
                    <div className='contactCard p1 justify-center'>
                        <div className='flex flex-row flex-wrap gap-2 justify-center items-center'>
                            <SiSkypeforbusiness></SiSkypeforbusiness>
                            <div className='email bold'>Porozmawiajmy</div>
                        </div>
                        <div className='email'>skype: bankera.pl</div>
                    </div>
                </div>
                </div>
            </div>  
        </Layout>
    )
}