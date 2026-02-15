import Image from "next/image";
import React from "react";
import {getTranslations} from "next-intl/server"

const Playstation5 = async () => {
  const t = await getTranslations("promotions.playstation")
  return (
    <div className="p-3 w-full h-full bg-bg-color flex center flex-col md:flex-row">
      <Image
        width={200}
        height={200}
        alt="playstation5"
        priority
        src={
          "http://194.156.118.210/uploads/images/image.webp"
        }
      />
      <div className="text-center md:text-left">
        <h1 className="realative text-[clamp(2rem,5vw,3.5rem)]   text-unactive-text">
          {t("title")} <span className="font-bold"></span>
        </h1>
        <p className="text-[clamp(0.875rem,2vw,1.125rem)] text-unactive-text leading-[clamp(1.5rem,3vw,2rem)] text-wrap">
          {t("description")}
        </p>
      </div>
    </div>
  );
};

export default Playstation5;
