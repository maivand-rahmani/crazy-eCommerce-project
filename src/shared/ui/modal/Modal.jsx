"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children, disableClose = false }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape" && !disableClose) onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [disableClose, isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9998 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => {
        if (!disableClose) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-[90%] max-w-md rounded-2xl bg-surface p-6 text-text  shadow-2xl animate-scaleIn border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={disableClose}
          className="absolute right-4 top-3 text-lg text-text hover:opacity-70 transition"
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
