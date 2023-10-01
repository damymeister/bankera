import '@/components/css/home.css';

import  '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from "react";
import Post from '@/components/post';

import  Link  from 'next/link';
export default function News() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/api/getPosts') // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
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