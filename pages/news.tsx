import '@/components/css/home.css';
import  '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from "react";
import Post_t from '@/components/post';

import  Link  from 'next/link';
import api_url from '@/lib/api_url';
import axios from 'axios';
import { Post } from '@prisma/client';
export default function News() {
    const [posts, setPosts] = useState([]);
    const [privilege, setPrivilege] = useState(0);

    useEffect(() => {
        // Get Posts
        const handleGetPosts = async () => {
            try {
                const url = api_url('posts')
                const { data } = await axios.get(url, {headers: {Accept: 'application/json'}})
                setPosts(data.sort((a: Post, b: Post) => { return a.posted_on < b.posted_on }))
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

    const responsiveGrid = {
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1rem',
      };
    
    return (
            <Layout>
                <div className="containerCustom borderLightY p-0">
                    <h1 className="py-4 text-2xl mb-8 textleft">Najnowsze Posty</h1>
                    {privilege > 1 && (
                    <Link href="/posts/editor" className="button2">
                        Dodaj nowy post
                    </Link>
                    )}
                    <div className="py-4 m-[1rem]">
                    <div className="grid" style={responsiveGrid}>
                        {posts.map((post, index) => (
                            <Post_t key={index} post={post} />
                        ))}
                    </div>
                    </div>
                </div>
                </Layout>
    );
}