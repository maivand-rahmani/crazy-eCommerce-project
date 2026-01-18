"use client";
import React, { useRef } from "react";
import ResponsibleBanner from "@/components/main/banners/ResponsibleBanner";

const bannersInfo = [
  {
    bg: "#FFFFFF",
    name: "Ipad pro",
    des: "iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.",
    link: "ipad",
    img: "https://vdtwjwohhdejjaweukxw.supabase.co/storage/v1/object/public/crazy/ProjectPics/image%2064.png",
  },
  {
    bg: "#F9F9F9",
    name: "Samsung Galaxy",
    des: "Samsung Galaxy is a series of mobile devices made by Samsung. Most of them are smartphones and tablet computers that run Android, an operating system made by Google. New models come out every year.",
    link: "Galaxy",
    img: "https://vdtwjwohhdejjaweukxw.supabase.co/storage/v1/object/public/crazy/ProjectPics/image%2041.png",
  },
  {
    bg: "#EAEAEA",
    name: "Mac Book Pro",
    des: "MacBook is a type of Mac laptop computer that is developed and marketed by Apple that use Apple's macOS operating system since 2006.",
    link: "Macbook",
    img: "https://vdtwjwohhdejjaweukxw.supabase.co/storage/v1/object/public/crazy/ProjectPics/Macbook%201.png",
  },
  {
    bg: "#2C2C2C",
    name: "Apple Watch",
    des: "Apple Watch is a smartwatch developed and marketed by Apple. It has fitness tracking, health-oriented capabilities, and wireless telecommunication, and integrates with watchOS and other Apple products and services.",
    link: "Apple watch",
    img: "https://vdtwjwohhdejjaweukxw.supabase.co/storage/v1/object/public/crazy/ProjectPics/312d013f4012ee11f7fa28b1b3c9b9ea%201.png",
  },
];

export default function DragScrollContainer({ children }) {
  const ref = useRef(null);

  const handleMouseDown = (e) => {
    const el = ref.current;
    if (!el) return;

    let startX = e.pageX - el.offsetLeft;
    let scrollLeft = el.scrollLeft;

    const handleMouseMove = (moveEvent) => {
      const x = moveEvent.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2; // скорость скролла
      el.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      el.style.cursor = "grab";
    };

    el.style.cursor = "grabbing";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={ref}
      // onMouseDown={handleMouseDown}
      className="overflow-auto whitespace-nowrap md:whitespace-normal md:cursor-default cursor-grab select-none flex snap-x scroll-smoot"
    >
      {bannersInfo.map((banner) => (
        <ResponsibleBanner
          className={""}
          bgColor={banner.bg}
          img={banner.img}
          key={banner.link}
          name={banner.name}
          des={banner.des}
          link={banner.link}
        />
      ))}
    </div>
  );
}
