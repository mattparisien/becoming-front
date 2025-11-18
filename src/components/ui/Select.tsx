"use client";

import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

interface SelectProps {
  name?: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export default function Select(props: SelectProps) {
  const { name, value, options, placeholder = "Select…", onValueChange, className } = props;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const selected = useMemo(() => options.find((o) => o.value === value) || null, [options, value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!triggerRef.current?.contains(t) && !listRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Manage keyboard on trigger
  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      const current = options.findIndex((o) => o.value === value);
      if (e.key === "ArrowDown") setActiveIndex(current >= 0 ? current : 0);
      if (e.key === "ArrowUp") setActiveIndex(current >= 0 ? current : Math.max(0, options.length - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        onValueChange(options[activeIndex].value);
        setOpen(false);
        triggerRef.current?.focus();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  // When opening, set active to current selection
  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setActiveIndex(idx);
    }
  }, [open, options, value]);

  return (
    <div className={classNames("relative inline-block align-baseline", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={name ? `${name}-listbox` : undefined}
        className={classNames(
          "ml-2 inline-flex items-center gap-2 bg-transparent underline-dash outline-none",
          "transition-colors",
          value ? "text-foreground" : "text-foreground/60"
        )}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg
          aria-hidden
          className={classNames("h-[0.8em] w-[0.8em] transition-transform", { "rotate-180": open })}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.958a.75.75 0 111.08 1.04l-4.24 4.52a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={name ? `${name}-listbox` : undefined}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className={classNames(
            "absolute left-0 mt-2 min-w-[16rem] z-50",
            "bg-background text-foreground border border-foreground/20 rounded-xl shadow-xl overflow-hidden"
          )}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={classNames(
                  "px-4 py-3 cursor-pointer text-base",
                  isActive ? "bg-foreground/10" : "",
                  isSelected ? "font-semibold" : ""
                )}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => {
                  // prevent blurring trigger before click completes
                  e.preventDefault();
                }}
                onClick={() => {
                  onValueChange(opt.value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
