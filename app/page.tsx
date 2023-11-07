"use client"

import '../components/css/post.css';
import '../components/css/home.css';
import './globals.css';

import React, { useEffect, useState } from "react";
import Service from '../components/service';
import Currency from '../components/site-elements/currency';
import { useExchangeRates } from '../components/functions/MoneyData';
import Post_t from '@/components/post';
import {FaChartLine, FaWallet, FaRegCreditCard}  from "react-icons/fa";
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
        <h1 className='Title uppercase'>Wielowalutowe usługi finansowe</h1>
        {/* <div className='rotating'></div> */}
        {/* <button className="button" text="Register">Register</button> */}
        {/* <button className="button2" text="Register">Login</button> */}
        <button className="button"><Link href="/zzz">check out new offer</Link></button>
  
        {/* <img src={phone} alt="My Image" style={{ maxWidth: '100%' }} /> */}
        <div className="services ">
                <Service 
                    service={{
                    name: 'Karty wielowalutowe',
                    icon: <FaRegCreditCard/>,
                    }}
                />
                <Service 
                    service={{
                    name: 'Rynek Forex',
                    icon: <FaChartLine/>,
                    }}
                />
                <Service 
                    service={{
                    name: 'Financial Planning',
                    icon: <FaWallet/>,
                    }}
                />
                <Service 
                    service={{
                    name: 'Financial Planning',
                    icon: <FaWallet/>,
                    }}
                />
                <Service 
                    service={{
                    name: 'Financial Planning',
                    icon: <FaWallet/>,
                    }}
                />
                <Service 
                    service={{
                    name: 'Financial Planning',
                    icon: <FaWallet/>,
                    }}
                />
        </div>
        <div className="currencies">
            <h1 className='py-1'>Kursy walut</h1>
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
        <div className='postSection py1 my1 anim3 borderLight'>
            <h1 className='pb-3'>Recent Posts</h1>
            <div className='postContainer px-1'>
                {posts.map((post, index) => (
                    <Post_t key={index} post={post} />
                ))}
            </div>
            <div className="circleBottom"></div>
            <Link href="/news" className="button2 ">Zobacz więcej</Link>
        </div>
        { privilege === 0 &&
        <div className="site-element2 mx1 anim3 py-1 borderLightY">
            <div className="register">
            <h1 className='py-5'>Załóż darmowe konto już dziś</h1>
            <Link href="/register" className="button4 py-3">Zarejestruj się za darmo</Link>
            {/* <button className="button2" text="Register">Zarejestruj się za darmo</button> */}
            {/* <CurrencyDataComponent /> */}
            </div>
        </div>
        }
    </div>
    {/* <Footer></Footer> */}
</main>
</Layout>
  );
}

