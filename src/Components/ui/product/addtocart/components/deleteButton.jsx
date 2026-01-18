import { X  } from "lucide-react";
import React from "react";


const DeleteButton = ({ handleClick, state = {} }) => {
  return (
    <button onClick={() => handleClick("delete")} className="flex center">
      <X color="red" className={`${state?.loading ? "opacity-50" : null}`} />
    </button>
  );
};

export default DeleteButton;
