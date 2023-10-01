import React from 'react';
import '@/components/css/post.css';
import '@/components/css/home.css';

const Post = ({ post }) => {
    const {  post_title, posted_on, post_content, user } = post; 

    return (
        <div className="Post mx1">
            <div className="PostBorder">
                <div className="PostInfo py1">
                    <div className="title px1">{post_title}</div>
                    <div className="date px1">{posted_on}</div>
                </div>
                <div className="PostContent">
                    <p className="px1 ">{post_content}</p>
                   
                </div>
                <div className="author ">
                        {user.first_name} {user.last_name} 
                    </div>
            </div>
        </div>
    );
};

export default Post;