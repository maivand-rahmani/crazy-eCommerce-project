"use client";
import React, { useRef } from "react";
import { ResponsibleBanner } from "@/features/home";
import { useTranslations } from "next-intl";

const bannersInfo = [
  {
    bg: "var(--banner-white)",
    key: "ipad",
    link: "ipad",
    img: "http://194.156.118.210/uploads/images/image%2064.png",
  },
  {
    bg: "var(--banner-light)",
    key: "samsung",
    link: "Galaxy",
    img: "http://194.156.118.210/uploads/images/image%2041.png",
  },
  {
    bg: "var(--banner-medium)",
    key: "macbookpro",
    link: "Macbook",
    img: "http://194.156.118.210/uploads/images/Macbook%201.png",
  },
  {
    bg: "var(--banner-dark)",
    key: "applewatch",
    link: "Apple watch",
    img: "http://194.156.118.210/uploads/images/312d013f4012ee11f7fa28b1b3c9b9ea%201.png",
  },
];

export default function DragScrollContainer({ children }) {
  const t = useTranslations("homeBanners");
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
          key={banner.key}
          name={t(`${banner.key}.title`)}
          des={t(`${banner.key}.description`)}
          link={banner.link}
        />
      ))}
    </div>
  );
}
