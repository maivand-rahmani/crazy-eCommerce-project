import Image from "next/image";
import {getTranslations} from "next-intl/server"
import React from "react";

const Iphone = async () => {
  const t = await getTranslations('hero')

  return (
    <div className="p-2 flex flex-col center bg-banner-1 md:flex-row  ">
      <div className="flex items-center md:items-baseline flex-col gap-6">
        <span className="text-[clamp(2rem,4vw,3rem)] text-text opacity-25">
          {t("tagline")}
        </span>

        <div className="font-extralight text-[clamp(3rem,8vw,8rem)] leading-[1.1] text-banner-white text-balance">
          {t("title")} <br />
          <span className="font-bold">{t("title2")}</span>
        </div>

        <p className="text-[clamp(1rem,2vw,1.25rem)] text-unactive-text">
           {t("subtitle")}
        </p>

        <button className="btn">{t("cta")}</button>
      </div>

      <div>
        <Image
          alt="Iphone17promax"
          width={500}
          height={500}
          priority
          src={
            "http://194.156.118.210/uploads/images/iPhone_17_Pro_Max_Cosmic_Orange_Position_1%201.png"
          }
        ></Image>
      </div>
    </div>
  );
};

export default Iphone;
