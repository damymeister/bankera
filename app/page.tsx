"use client"

import '../components/css/post.css';
import '../components/css/home.css';
import '../components/css/header.css';
import './globals.css';

import React, { useEffect, useState } from "react";
import Service from '../components/service';
import Currency from '../components/site-elements/currency';
import { useExchangeRates } from '../components/functions/MoneyData';
import Post_t from '@/components/post';
import {FaChartLine, FaWallet, FaRegCreditCard, FaExchangeAlt}  from "react-icons/fa";
import  Link  from 'next/link';
import Layout from './layoutPattern';

import { Post, PrismaClient } from '@prisma/client';
import api_url from '@/lib/api_url';
import axios from 'axios';
const prisma = new PrismaClient();

export default function Home() {
  

    const [privilege, setPrivilege] = useState(0);
    const { currencies, date } = useExchangeRates();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Get Posts
        const handleGetPosts = async () => {
            try {
                const url = api_url('posts')
                const { data } = await axios.get(url, {headers: {Accept: 'application/json'}})
                setPosts(data.sort((a: Post, b: Post) => { return a.posted_on < b.posted_on }).slice(0, 3))
            } catch (error) {
                console.log('unexpected error: ', error)
            }
        }
        handleGetPosts()
        const handleGetPrivilege = async () => {
            try {
                const url = api_url('privilege')
                const { data } = await axios.get(url, {headers: {Accept: 'application/json'}})
                setPrivilege(parseInt(data.privilege))
            } catch (error) {
                console.log('unexpected error: ', error)
            }
        }
        handleGetPrivilege()
    }, []);


    
  return (

    <Layout>
    <main>
        {/* <Navbar></Navbar> */}
    <div className="content">    
        <div className='header mt-6 p-4'>
            <h1 className='Title uppercase lg:text-2xl md:text-xl mb-4'>Wielowalutowe usługi finansowe</h1>
            {/* <div className='rotating'></div> */}
            {/* <button className="button" text="Register">Register</button> */}
            {/* <button className="button2" text="Register">Login</button> */}
            {/* <button className="button"><Link href="/zzz">check out new offer</Link></button> */}
            {/* <img src={phone} alt="My Image" style={{ maxWidth: '100%' }} /> */}
            { privilege === 0 &&
                <div className='mt-8 mb-8'><Link href="/register" className="button2">Zarejestruj się za darmo</Link></div>
            }
            
            <div className="servicesContainer py-4 mt-4  ">
            <a className='lg:text-3xl md:text-2xl textUnderline'>Strona umożlwia</a>
                <div className="services mt-4 lg:text-2xl">
                    <a className='flex flex-row items-center'>
                        <div className="mr-2"><FaChartLine/></div>
                        <div> Rynek Forex</div>
                    </a>
                    <a className='flex flex-row items-center'>
                        <div className="mr-2"><FaChartLine/></div>
                        <div> Kursy wymiany walut</div>
                    </a>
                    <a className='flex flex-row items-center'> 
                        <div className="mr-2"><FaExchangeAlt/></div>
                        <div> Wymiana walut</div>
                    </a>
                    <a className='flex flex-row items-center'> 
                        <div className="mr-2"><FaExchangeAlt/></div>
                        <div> Wymiany z innymi użytkownikami</div>
                    </a>
                </div>
            </div>
        </div>
        <div className="currencies">
            <h1 className='py-4 lg:text-3xl md:text-2xl textUnderline'>Kursy walut</h1>
            <h4 className="textLeft">Ostatnia aktualizacja: {date}</h4>
            
            <div className="Topcurrencies">
                {currencies.slice(0, 3).map((currency, index) => (
                    <Currency key={index} currency={currency} />
                ))}
            </div>
          
                <Link href="/exchangeRates" className="button2">Zobacz wszystkie kursy</Link>

        </div>

            {/* <img src={BottomSectionSvg} alt="Bottom Section Image"  className="svg2"/> */}
        <div className="site-element mx-1"></div>
        <div className='postSection  anim3 borderLight'>
            <h1 className='py-4 lg:text-3xl md:text-2xl textUnderline'>Recent Posts</h1>
            <div className='pt-4 postContainer px-1'>
                {posts.map((post, index) => (
                    <Post_t key={index} post={post} />
                ))}
            </div>
            <div className="circleBottom"></div>
            <Link href="/news" className="button2 ">Zobacz więcej</Link>
        </div>
        { privilege === 0 &&
        <div className="site-element2 mx-4 anim3 py-1 borderLightY">
            <div className="register">
            <h1 className='py-5 my-4 lg:text-3xl md:text-2xl'>Załóż darmowe konto już dziś</h1>
            <Link href="/register" className="button4 py-3">Zarejestruj się za darmo</Link>

            </div>
        </div>
        }
    </div>
   
</main>
</Layout>
  );
}

