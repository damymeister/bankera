import '@/components/css/home.css';

import  '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from "react";
import Post from '@/components/post';

import  Link  from 'next/link';
import api_url from '@/lib/api_url';
import axios from 'axios';
export default function News() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Get Posts
        const handleGetPosts = async () => {
            try {
                const url = api_url('posts')
                const { data } = await axios.get(url, {headers: {Accept: 'application/json'}})
                setPosts(data)
            } catch (error) {
                console.log('unexpected error: ', error)
            }
        }
        handleGetPosts()
    }, []);

    return (
        <Layout>
            <div className="containerCustom borderLightY p0">
            <Link href="/posts/create" className="button2">Dodaj nowy post</Link>
                <div className="py-5 my1">
                    <h1 className="py-6 textleft">Najnowsze Posty</h1>
                    <div className="px-1">
                        {posts.map((post, index) => (
                            <Post key={index} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}