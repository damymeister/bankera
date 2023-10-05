import React, { useEffect, useState } from 'react';
import '@/components/css/post.css';
import '@/components/css/home.css';
import axios from 'axios';
import api_url from '@/lib/api_url';
import { Post } from '@prisma/client';
import Link from 'next/link';

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
        <div className="Post mx1">
            <div className="PostBorder">
                <div className="PostInfo py1">
                    <div className="title px1">{props.post.title}</div>
                    <div className="date px1">{new Date(props.post.posted_on).toLocaleString()}</div>
                </div>
                <div className="PostContent">
                    <p className="px1 ">{props.post.content}</p>
                
                </div>
                <div className="author ">
                    {props.post.user.first_name + " " + props.post.user.last_name}
                        {/* {user.first_name} {user.last_name}  */}
                </div>
                {privilege >= 2 &&
                    <div>
                        <Link className="button3" href={"/posts/editor?id=" + props.post.id}>Edit</Link>
                        <button className='button4' onClick={() => {
                            handleDeletePost(props.post.id)
                        }}>Delete</button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Post_t;