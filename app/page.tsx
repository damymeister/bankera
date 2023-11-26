"use client"

import '../components/css/post.css';
import '../components/css/home.css';
import '../components/css/header.css';
import './globals.css';

import React, { useEffect, useState } from "react";
import Currency from '@/components/currency';
import Post_t from '@/components/post';
import {FaChartLine, FaCoins, FaExchangeAlt, FaHistory, FaMoneyBill, FaUser}  from "react-icons/fa";
import  Link  from 'next/link';
import Layout from './layoutPattern';

import { Post, PrismaClient } from '@prisma/client';
import api_url from '@/lib/api_url';
import axios from 'axios';
const prisma = new PrismaClient();

export default function Home() {
  

    const [privilege, setPrivilege] = useState(0);
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
            { privilege === 0 &&
                <div className='mt-8 mb-8'><Link href="/register" className="button2">Zarejestruj się za darmo</Link></div>
            }
            
            <div className="servicesContainer py-4 mt-4  ">
            <a className='lg:text-3xl md:text-2xl textUnderline'>Aplikacja zapewnia</a>
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
                        <div> Wymianę walut</div>
                    </a>
                    <a className='flex flex-row items-center'> 
                        <div className="mr-2"><FaExchangeAlt/></div>
                        <div> Wymiany z innymi użytkownikami</div>
                    </a>
                </div>
            </div>
        </div>
        <>
            <div className="currencies">
                <h1 className='py-4 lg:text-3xl md:text-2xl textUnderline'>Kursy walut</h1>
                <div className="Topcurrencies">
                    <Currency/>
                </div>
                {
                    privilege > 0 ?
                    <Link href="/exchangeRates" className="button2">Zobacz wszystkie kursy</Link>
                    : <span>Zaloguj się aby wyświetlić więcej kursów</span>
                }
            </div>
            <div className="site-element mx-1"></div>
        </>
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

        <div className='flex flex-col items-center mb-8'>
        <div className="mx-4 py-4 my-4 flex flex-col lg:flex-row sm:flex-col content-center items-center">
        <div className="pl-8 text-6xl sm:order-first lg:order-last">
            <FaCoins />
        </div>
        <div className="textleft">
            <div className="lg:text-3xl md:text-2xl textUnderline my-2">Dostęp do 169 walut</div>
            <div className="flex flex-row">
            <div className="pr-2">Nasza aplikacja obsługuje aż</div>
            <div className="text-[#BB86FC]">169 walut!</div>
            </div>
        </div>

        </div>
        <div className="mx-4 py-4 my-4 flex flex-col lg:flex-row sm:flex-col content-center items-center">
        <div className="pl-8 text-6xl sm:order-first lg:order-last">
            <FaHistory />
        </div>
            <div className="textleft">
                <div className="lg:text-3xl md:text-2xl textUnderline my-2">Historia wszystkich walut</div>
                <div className="flex flex-row">
                <div className="pr-2">Historie wszystkich walut do</div>
                <div className="text-[#BB86FC]">30 dni</div>
                <div className="pl-2">wstecz</div>
                </div>
            </div>
            </div>
            <div className="mx-4 py-4 my-4 flex flex-col lg:flex-row sm:flex-col content-center items-center">
            <div className="pl-8 text-6xl sm:order-first lg:order-last">
                <FaUser />
            </div>
            <div className="textleft">
                <div className="lg:text-3xl md:text-2xl textUnderline my-2">Przejrzysty interfejs</div>
                <div className="flex flex-row">
                <div className="pr-2">Prosty i</div>
                <div className="text-[#BB86FC]">przejrzysty</div>
                <div className="pl-2">interfejs dla użytkownika</div>
                </div>
            </div>
            </div>
        </div>
        { privilege === 0 &&
            <div className="mx-4 py-1 text-center bgGlass mb-8">
                <div className="register">
                    <h1 className="py-5 my-[3rem] lg:text-3xl md:text-2xl flex flex-row justify-center">
                    Załóż 
                    <div className="text-[#BB86FC] px-2">Darmowe</div>
                    konto już dziś!
                    </h1>
                    <Link href="/register" className="button4 py-3">Zarejestruj się za darmo</Link>
                </div>
            </div>
        }
    </div>
   
</main>
</Layout>
  );
}

