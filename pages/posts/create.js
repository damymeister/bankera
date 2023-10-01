import { useState } from 'react';
import { PrismaClient } from '@prisma/client';
import '@/components/css/home.css';

import '@/components/css/forms.css';
import  '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import '@/components/css/tailwind.css';
import  Link  from 'next/link';
const prisma = new PrismaClient();

export default function CreatePost() {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (postTitle.length < 10 || postContent.length < 25) {
        setErrorMessage('Title should be at least 10 characters long and content should be at least 25 characters long');
        setSuccessMessage('');
        return;
      }

      const response = await fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_title: postTitle, post_content: postContent }),
      });

      if (response.ok) {
        setSuccessMessage('Post created successfully');
        setErrorMessage('');
        // Redirect or show success message
      } else {
        setErrorMessage('Error creating post');
        setSuccessMessage('');
        // Show error message
      }
    } catch (error) {
      setErrorMessage('Error creating post');
      setSuccessMessage('');
      // Show error message
    }
  };

  return (
    <Layout>
        <div className="containerCustom borderLightY">
        <div className="p-4 bg-[#1f1b24b2] shadow-md text-white rounded-md">
        <h1 className="text-3xl font-bold mb-4">Create a new post</h1>
        {successMessage && <div className="text-green-500">{successMessage}</div>}
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 my-4 flex flex-col items-center justify-center">
            <input
                type="text"
                placeholder="Post title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-1/4 px-4 py-2 border bgdark  rounded-md focus:outline-none focus:border-blue-500"
            />
            <textarea
                placeholder="Post content"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-1/2 px-4 py-2 border bgdark  border-[#996dce] rounded-md focus:outline-none focus:border-blue-500"
            ></textarea>
            <div className='flex flex-row w-1/2 items-center justify-center'>
            <Link href="/news" className="w-2/5 px-4 mx-4 py-2 bg-[#6da0f6] hover:bg-blue-500 text-[white] rounded-md2">wróć</Link>
            <button
                type="submit"
                className="w-2/5 px-4 py-2 bg-[#BB86FC] hover:bg-[#996dce] text-[white] rounded-md"
                >
                Create Post
            </button>
            
            </div>
        </form>
        </div>
        </div>
    </Layout>
  );
}