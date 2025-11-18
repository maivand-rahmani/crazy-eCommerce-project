"use client";
import Miniloader from "@/Components/Loading/ComponentLoader/miniloader";
import Image from "next/image";
import React, { Suspense, useRef, useState } from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const Slider = ({ images }) => {
  let length = images.length;
  let [clicked, setClicked] = useState(false);
  let [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return <Miniloader />;
  }

  return (
    <div className="snap-y center flex flex-col-reverse md:flex-row gap-5 transition-all w-full h-full">
      <div className="flex gap-5 z-10 md:flex-col md:max-h-125 overflow-auto  whitespace-nowrap md:whitespace-normal md:cursor-default cursor-grab select-none snap-x scroll-smoot">
        {images.map((image, index) => (
          <div
            key={image.url}
            className={
              image.url === images[activeIndex % length]?.url
                ? "opacity-100 shadow-lg rounded-2xl transition hover:-translate-y-1"
                : "opacity-40"
            }
          >
            <Image
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
              className="select-none snap-center max-w-35 max-h-35 object-contain p-2"
              alt={image.url}
              onClick={() => setActiveIndex(index)}
              src={image.url}
              width={100}
              height={150}
              key={image.url}
            />
          </div>
        ))}
      </div>
      <div
        className={`${
          clicked
            ? "absolute z-50 bg-black/80 w-full h-full inset-0   flex center"
            : " md:max-h-125 md:max-w-125 "
        }   transition-all duration-500 rounded-2xl md:w-full md:h-full md:full`}
      >
        <div className="max-h-[inherit]  flex center bg-white relative rounded-2xl shadow-2xl p-10">
          <div
            onClick={() => {
              setActiveIndex((prev) => prev - 1 + length);
            }}
            className="bg-unactive-text/30 z-0 p-5 absolute top-[45%] left-0"
          >
            <ArrowBigLeft />
          </div>
          <div
            onClick={() => {
              setActiveIndex((prev) => prev + 1);
            }}
            className="bg-unactive-text/30 z-0 p-5 absolute top-[45%]  right-0"
          >
            <ArrowBigRight />
          </div>
            <Suspense fallback="loading">
              <Image
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            className=" select-none object-contain max-h-[-webkit-fill-available]"
            alt={"product"}
            src={images[activeIndex % length]?.url}
            width={500}
            height={500}
            onClick={() => setClicked(!clicked)}
          />
            </Suspense>
          
        </div>
      </div>
    </div>
  );
};

export default Slider;
