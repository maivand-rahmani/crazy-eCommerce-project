"use client";
import Miniloader from "@/components/Loading/ComponentLoader/miniloader";
import Image from "next/image";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Fetch from "@/funcs/fetch";

const Slider = ({ productId, variantId }) => {
  let [clicked, setClicked] = useState(false);
  let [images, setImages] = useState();
  let [length, setLength] = useState(0);
  let [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!productId || !variantId) return;
    if (images) return; // уже загружено

    async function getImages() {
      const data = await Fetch(
        `/api/products/images?productId=${
          productId ? productId : undefined
        }&variantId=${variantId ? variantId : undefined}`
      );

      const filteredImages = data.data.filter(
        (img) => img.variant_id == variantId || !img.variant_id
      );

      setImages(filteredImages);
      setLength(filteredImages.length);

      console.log(images, data, filteredImages);
    }

    getImages();
  }, [productId, variantId]);

  return (
    images && (
      <div className="snap-y center flex flex-col-reverse md:flex-row gap-5 transition-all w-full h-full">
        <div className="flex gap-5 z-10 md:flex-col md:max-h-125 overflow-auto  whitespace-nowrap md:whitespace-normal md:cursor-default cursor-grab select-none snap-x scroll-smoot">
          {images &&
            images.map((image, index) => (
              <div
                key={image.url}
                className={
                  image.url === images[activeIndex % length]?.url
                    ? "opacity-100 shadow-lg rounded-2xl transition hover:-translate-y-1"
                    : "opacity-40"
                }
              >
                <img
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
    )
  );
};

export default Slider;
