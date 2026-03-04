"use client";

import React from "react";
import { useRouter, usePathname } from "@/shared/i18n";
import { useLocale } from "next-intl";
import styled from "styled-components";

const LangSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = (nextLocale) => {
    if (nextLocale === locale) return;

    router.replace(pathname, { locale: nextLocale , scroll: false});
  };

  return (
    <StyledWrapper>
      <form
        className="radio-input"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          const target = e.target;
          if (target.type === "radio") {
            changeLang(target.value.toLowerCase());
          }
        }}
      >
        {["ru", "en", "fa"].map((lang) => (
          <label key={lang} className="label">
            <input
              type="radio"
              name="locale"
              value={lang}
              checked={locale === lang}
              readOnly
            />
            <span className="text">{lang.toUpperCase()}</span>
          </label>
        ))}
      </form>
    </StyledWrapper>
  );
};

export default LangSwitcher;

const StyledWrapper = styled.div`
  .radio-input {
    display: flex;
    align-items: center;
    gap: 2px;
    background-color: #333333;
    padding: 4px;
    border-radius: 10px;
  }

  .radio-input input {
    display: none;
  }

  .radio-input .label {
    width: 70px;
    height: 45px;
    background: linear-gradient(to bottom, #333333, rgb(36, 35, 35));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s linear;
    border-top: 1px solid #4e4d4d;
    position: relative;
    cursor: pointer;
    box-shadow: 0px 17px 5px 1px rgba(0, 0, 0, 0.2);
  }

  .label:has(input[type="radio"]:checked) {
    box-shadow: none;
    background: linear-gradient(to bottom, #1d1d1d, #1d1d1d);
    border-top: none;
  }

  .label:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  .label:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  .label::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 103%;
    height: 100%;
    border-radius: 10px;
    transition: all 0.1s linear;
    z-index: -1;
  }

  .label:has(input[type="radio"]:checked)::before {
    background: linear-gradient(
      to bottom,
      transparent 10%,
      #cae2fd63,
      transparent 90%
    );
  }

  .label .text {
    color: black;
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    transition: all 0.1s linear;
    text-shadow:
      -1px -1px 1px rgba(224, 224, 224, 0.1),
      0px 2px 3px rgba(0, 0, 0, 0.3);
  }

  .label input[type="radio"]:checked + .text {
    color: rgb(202, 226, 253);
    text-shadow: 0px 0px 12px #cae2fd;
  }
`;
