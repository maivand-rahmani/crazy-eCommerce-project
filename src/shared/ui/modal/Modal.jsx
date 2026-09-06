"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({
  isOpen,
  onClose,
  children,
  disableClose = false,
  label,
}) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Remember what had focus so we can restore it on close.
    previouslyFocusedRef.current = document.activeElement;

    const handleEsc = (e) => {
      if (e.key === "Escape" && !disableClose) onClose();
    };

    // Lightweight focus trap: keep Tab cycling inside the dialog.
    const handleTab = (e) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) {
        e.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("keydown", handleTab);
    document.body.style.overflow = "hidden";

    // Initial focus: first focusable element, else the dialog itself.
    const timer = setTimeout(() => {
      const first = dialogRef.current?.querySelector(FOCUSABLE_SELECTOR);
      (first ?? dialogRef.current)?.focus();
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "";
      // Restore focus to whatever opened the modal.
      if (previouslyFocusedRef.current?.focus) {
        previouslyFocusedRef.current.focus();
      }
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="relative max-h-[90vh] w-[90%] max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 text-text shadow-2xl outline-none animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={disableClose}
          aria-label="Close"
          className="absolute right-4 top-3 text-lg text-text transition hover:opacity-70"
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
