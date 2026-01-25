import { X  } from "lucide-react";
import React from "react";


const DeleteButton = ({ handleClick, state = {} }) => {
  return (
    <button onClick={() => handleClick("delete")} className={` flex center bg-red-500 md:max-w-30 rounded-2xl text-white w-full ${state?.loading ? "opacity-50" : null}`} >
      delete
    </button>
  );
};

export default DeleteButton;
