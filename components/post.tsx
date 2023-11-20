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
        <div className="Post mx-4">
            <div className="PostBorder">
                <div className="PostInfo py-5">
                    <div className="title px-4">{props.post.title}</div>
                    <div className="date px-4">{new Date(props.post.posted_on).toLocaleString()}</div>
                </div>
                <div className="PostContent">
                    <p className="px-4 ">{props.post.content}</p>
                
                </div>
                <div className="author ">
                    {props.post.user.first_name + " " + props.post.user.last_name}
                        {/* {user.first_name} {user.last_name}  */}
                </div>
                {privilege >= 2 &&
                    <div className='flex flex-row-reverse py-5'>
                        <Link className="text-blue-400 hover:text-blue-800 mx-1" href={"/posts/editor?id=" + props.post.id}><FaEdit>Edit</FaEdit></Link>
                        <FaTrash className="text-red-400 hover:text-red-800 mx-1" onClick={() => {
                            handleDeletePost(props.post.id)
                        }}>Delete</FaTrash>
                    </div>
                }
            </div>
        </div>
    );
};

export default Post_t;