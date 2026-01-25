import React from "react";
import Image from "next/image";
import {getTranslations} from "next-intl/server"


const Macbook = async () => {
  const t = await getTranslations('promotions.macbook')

  return (
    <div className="w-full flex flex-col h-full bg-1banner-bg center md:flex-row p-3">
      <Image
        width={430}
        height={330}
        alt="Mac book pro"
        priority
        src={
          "http://194.156.118.210/uploads/images/apple-macbook-air-15in-m4.png"
        }
      ></Image>
      <div className="p-4 relative md:right-20 flex items-center flex-col gap-6 md:items-start text-center md:text-left">
        <span className="text-[clamp(1.25rem,2vw,1.75rem)] text-black opacity-25">
          {t("tagline")}
        </span>

        <div className="text-[clamp(2.5rem,6vw,4rem)] leading-[1.1] text-black font-bold text-balance">
          MacBook Air <br />
          <span className="font-extralight">15-inch</span>
        </div>

        <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-unactive-text">
           {t("description")}
        </p>

        <button className="btn">{t("cta")}</button>
      </div>
    </div>
  );
};

export default Macbook;
