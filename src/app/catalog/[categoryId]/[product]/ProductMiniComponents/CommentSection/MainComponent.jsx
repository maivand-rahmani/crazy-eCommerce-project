import React from 'react'
import CommentSection from './CommentSection/CommentSection';
import Fetch from '@/funcs/fetch';
import { clerkClient } from "@clerk/nextjs/server";

function serializeUsers(users){
 
  return users.data.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
  }));
}


const MainCommentComponent = async ({ productID }) => {
    const data = await Fetch(`/api/products/comments?id=${productID}`);

    const ids = [...new Set(data.map(c => c.user_id))]

    const client = await clerkClient();
    const users = await client.users.getUserList({
      userId: ids,
      limit: 100,
    })
     
  const serializedUsers = serializeUsers(users)
  

  const commentsWithUsers = data.map(comment => {
    const user = serializedUsers.find(u => u.id === comment.user_id);
    return { ...comment, user: user };
  });


  return (
    <div>
        <CommentSection initialProducts={commentsWithUsers} productID={productID} users={serializedUsers}/>
    </div>
  )
}

export default MainCommentComponent