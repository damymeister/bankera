import React, { useEffect, useState } from 'react';
import '@/components/css/post.css';
import '@/components/css/home.css';
import '@/components/css/tailwind.css';
import axios from 'axios';
import api_url from '@/lib/api_url';
import { Post } from '@prisma/client';
import Link from 'next/link';
import { FaTrash, FaEdit } from 'react-icons/fa';
const handleDeletePost = async (id:number) => {
    try {
        const url = api_url('auth/redaktor/post')
        const { data } = await axios.delete(url, {data: {id:id}, headers: {Accept: 'application/json'}})
        window.location.reload()
    } catch (error) {
        console.log('unexpected error: ', error)
    }
}

const Post_t = (props: { post: any }) => {
   
    const [editMode, setEditMode] = useState(false)
    const [privilege, setPrivilege] = useState(0)

    useEffect (() => {
        // Get Privilege
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
    }, [])    

    return (
        

<div className="m-auto overflow-hidden rounded-lg shadow-lg cursor-pointer h-90 w-60 md:w-80 text-left pt-4">
    <a href="#" className="block w-full h-full">
        <img alt="blog photo" src={props.post.image_href} className="object-cover w-full max-h-40"/>
        <div className="w-full p-4 bg-[#151521]">
            <p className="font-medium text-[#BB86FC] text-md">
                Artykuł
            </p>
            <p className="mb-2 text-xl font-medium text-white">
                {props.post.title}
            </p>
            <p className=" h-36 min-h-full max-h-36 text-gray-300 text-md text-ellipsis overflow-hidden ...">
                {props.post.content}
            </p>
            <div className="flex items-center mt-4">
                <div className="flex flex-col justify-between ml-4 text-sm">
                    <p className="text-white">
                        {props.post.user.first_name + " " + props.post.user.last_name}
                    </p>
                    <p className="text-gray-300">
                        {new Date(props.post.posted_on).toLocaleString()}
                    </p>
                </div>
                {privilege >= 2 &&
                    <div className='flex flex-row-reverse py-5 pl-8 items-end justify-end'>
                        <Link className="text-blue-400 hover:text-blue-800 mx-1" href={"/posts/editor?id=" + props.post.id}><FaEdit>Edit</FaEdit></Link>
                        <FaTrash className="text-red-400 hover:text-red-800 mx-1" onClick={() => {
                            handleDeletePost(props.post.id)
                        }}>Delete</FaTrash>
                    </div>
                }
            </div>
        </div>
    </a>
</div>

    );
};

export default Post_t;