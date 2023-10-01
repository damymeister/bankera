import '@/components/css/home.css';
import '@/components/css/footer.css';
import '@/app/globals.css';
import React from "react";
import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare, FaGithub } from "react-icons/fa";

export default function Footer(){
    return(
        <div className="FooterInfo">
            
           {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#1f1b24" fill-opacity="1" d="M0,32L60,53.3C120,75,240,117,360,133.3C480,149,600,139,720,112C840,85,960,43,1080,32C1200,21,1320,43,1380,53.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">    
            </path>
           </svg> */}
           
           <div className='FooterinfoText'>
            
                <div className='FooterTitle'>BANKERA</div>
                <div className='footerLinks'>
                    <a href="https://www.facebook.com"> <FaFacebookSquare/> Facebook </a>
                    <a href="https://www.instagram.com"> <FaInstagramSquare/> Instagram </a>
                    <a href="https://twitter.com"> <FaTwitterSquare/> Twitter </a>
                </div>
                <div className='footerMoreInfo '>
                    <a href="https://github.com/RaViii1/praca-dyplomowa"> <FaGithub/> Project on github </a>
                </div>
           </div>
           
        </div>
    )
}
