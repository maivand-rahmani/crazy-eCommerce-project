import { X  } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";


const DeleteButton = ({ handleClick, state = {} }) => {
  const t = useTranslations("common");
  return (
    <button onClick={() => handleClick("delete")} className={` flex center bg-danger md:max-w-30 rounded-2xl text-danger-text w-full ${state?.loading ? "opacity-50" : null}`} >
      {t("delete")}
    </button>
  );
};

export default DeleteButton;
