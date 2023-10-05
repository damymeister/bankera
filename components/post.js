import React from 'react';
import '@/components/css/post.css';
import '@/components/css/home.css';

const Post = ({ post }) => {
   

    return (
        <div className="Post mx1">
            <div className="PostBorder">
                <div className="PostInfo py1">
                    <div className="title px1">{post.post_title}</div>
                    <div className="date px1">{new Date(post.posted_on).toLocaleString()}</div>
                </div>
                <div className="PostContent">
                    <p className="px1 ">{post.post_content}</p>
                   
                </div>
                <div className="author ">
                        {/* {user.first_name} {user.last_name}  */}
                    </div>
            </div>
        </div>
    );
};

export default Post;