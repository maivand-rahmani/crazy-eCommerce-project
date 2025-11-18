"use client";
import { SignedIn } from "@clerk/nextjs";
import React, { useState } from "react";
import { EllipsisVertical, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { LikeDisLike } from "./likeComponent";
import { Container, Edit01, Delete } from "@untitledui/icons";
import { Dropdown } from "@/Components/base/dropdown/dropdown";

const DropdownIcon = ({ setEditing , editing }) => (
  <Dropdown.Root>
    <Dropdown.DotsButton />
    <Dropdown.Popover className={"bg-white"}>
      <Dropdown.Menu>
        <Dropdown.Section>
          <Dropdown.Item icon={Edit01} onClick={() => setEditing(!editing)}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item icon={Delete}>Delete</Dropdown.Item>
        </Dropdown.Section>
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown.Root>
);

const CommentComponent = ({ comment, user }) => {
  const [Comment, editComment] = useState(comment?.comment);
  const [editing, setEditing] = useState(false);
  
 

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
              {comment?.created_at.split("T")[0]}
            </span>
          </div>
          <DropdownIcon setEditing={setEditing} editing={editing} />
        </div>
        <form className="pl-4 gap-5 grid grid-cols-[50px_1fr_100px]">
          <span className="p-1 self-start rounded center flex bg-blue-500 text-white">
            {comment?.rating}
            <Star width={15} height={15} />
          </span>
          <textarea
            disabled={!editing}
            value={Comment}
            
            className="resize-none h-full"
            onChange={(e) => editComment(e.target.value)}
          ></textarea>

          {editing && (
            <button className="p-2 self-start bg-blue-500 rounded text-white">submit</button>
          )}
        </form>
        <LikeDisLike comment={comment} />
      </div>
    </div>
  );
};

export default CommentComponent;
