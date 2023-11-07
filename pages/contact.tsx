import '@/components/css/home.css';
import '@/components/css/contact.css';
import '@/components/css/post.css';
import React from "react";
import Layout from '@/app/layoutPattern';
import '@/app/globals.css';
export default function Contact() {

    return (
        <Layout>
            <div className="containerCustom borderLightY">
                <div className=" py1 my1">
                <h1 className='py1'>Kontakt</h1>
                <h4 className='py1 '>W razie potrzeby skontaktuj się znami za pomocą podanych metod:</h4>
                <div className="contact">
                    <div className='contactCard p1'>E-mail
                    <div className='email bold'>Napisz do nas wiadomość:</div>
                    <div className='email'>s95360@pollub.edu.pl</div>
                    </div>
                    <div className='contactCard p1'>Telefon
                    <div className='email bold'>Zadzwoń do nas :</div>
                    <div className='email'>123 456 789</div>
                    </div>
                </div>
                </div>
            </div>  
        </Layout>
    )
}