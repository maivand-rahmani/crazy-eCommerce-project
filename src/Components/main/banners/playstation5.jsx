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
          "https://vdtwjwohhdejjaweukxw.supabase.co/storage/v1/object/public/crazy/ProjectPics/image.webp"
        }
      />
      <div className="text-center md:text-left">
        <h1 className="realative text-[clamp(2rem,5vw,3.5rem)]   text-unactive-text">
          Playstation 5 <span className="font-bold">Pro</span>
        </h1>
        <p className="text-[clamp(0.875rem,2vw,1.125rem)] text-unactive-text leading-[clamp(1.5rem,3vw,2rem)] text-wrap">
          {t("description")}
        </p>
      </div>
    </div>
  );
};

export default Playstation5;
