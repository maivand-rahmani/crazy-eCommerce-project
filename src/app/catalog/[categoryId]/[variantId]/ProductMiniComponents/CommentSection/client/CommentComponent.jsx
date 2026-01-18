"use client";
import {  useAuth } from "@clerk/nextjs";
import React, { useState , useEffect } from "react";
import {   Star } from "lucide-react";
import { LikeDisLike } from "./likeComponent";
import {  Edit01, Delete } from "@untitledui/icons";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import Fetch from "@/funcs/fetch";
import Rating from "./Rating";
import { toast } from 'react-hot-toast';

const DropdownIcon = ({
  setEditing,
  editing,
  comment,
  handleDelete,
}) => (
  <Dropdown.Root>
    <Dropdown.DotsButton />
    <Dropdown.Popover className={"bg-white"}>
      <Dropdown.Menu>
        <Dropdown.Section>
          <Dropdown.Item
            icon={Edit01}
            onClick={() => {
              setEditing(!editing)
            }}
          >
            Edit
          </Dropdown.Item>
          <Dropdown.Item icon={Delete} onClick={() => handleDelete(comment.id)}>
            Delete
          </Dropdown.Item>
        </Dropdown.Section>
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown.Root>
);

const CommentComponent = ({ comment, user, handleDelete, handleEdit }) => {
  const [commentText, editCommentText] = useState(comment?.comment);
   
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(comment?.rating); //
  const { getToken, userId } = useAuth();
   


  const deleteComment = async (commentId) => {
    const token = await getToken()
    const data = await Fetch(
      `/api/products/comments`,
      "DELETE",
      token ,
      { id: commentId }
    );
    if (data?.status === 201) {
      handleDelete(commentId);
      toast.success("comment succsesfully deleted")
      return true;
    } else {
      return false;
    }
  };

  const editComment = async (commentId) => {
    const token = await getToken()
    const data = await Fetch(
      `/api/products/comments`,
      "PUT",
      token ,
      { id: commentId, comment: commentText, rating: rating }
    );
    if (data?.status === 201) {
      handleEdit(data.comment);
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await editComment(comment.id)
    if(res) {
      toast.success("comment succsesfully edited")
      setEditing(i => !i)
    } else {
      toast.error("something gone wrong")
    }
  }

  return (
    <div className="w-full h-full shadow-xl grid grid-cols-[40px_1fr] border-b-1 border-b-unactive-text rounded-2xl p-4">
      <img
        className="rounded-full"
        width={40}
        height={40}
        src={user?.imageUrl}
        alt="image"
      />
      <div>
        <div className="flex w-full h-10 pl-4 justify-between items-center">
          <div className="flex gap-2 h-full center">
            <h1>{user?.fullName}</h1>
            <span className="text-unactive-text">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          {user?.id === userId && (
            <DropdownIcon
              setEditing={setEditing}
              comment={comment}
              editing={editing}
              handleDelete={deleteComment}
            />
          )}
        </div>
        <form className="pl-4" onSubmit={handleSubmit}>
          <div className="w-full gap-5 grid grid-cols-[50px_1fr_100px]">
            <span className="p-1 self-start rounded center flex bg-blue-500 text-white">
              {rating}
              <Star width={15} height={15} />
            </span>
            <textarea
              disabled={!editing}
              autoFocus={editing}
              value={commentText}
              className="resize-none h-full"
              aria-label="comment for product"
              onChange={(e) => editCommentText(e.target.value)}
            ></textarea>

            {editing && (
              <button className="p-2 self-start bg-blue-500 rounded text-white" aria-label="edited comment submitting">
                Submit
              </button>
            )}
          </div>
          {editing && (
            <div>
              <Rating onChange={setRating} value={rating} />
            </div>
          )}
        </form>
        <LikeDisLike
          commentId={comment.id}
          dislikes={comment.dislikes}
          userReaction={comment.userReaction}
          likes={comment.likes}
        />
      </div>
    </div>
  );
};

export default CommentComponent;
