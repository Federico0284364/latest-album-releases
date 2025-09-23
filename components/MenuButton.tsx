"use client";
import { ReactNode } from "react";
import { useState } from "react";
import Button from "./Button";

type Props = {
  className?: string;
  isOpen: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function MenuButton({ className, onClick, isOpen }: Props) {
  return (
    <Button onClick={onClick} className={className}>
      {isOpen ? (
        <svg
          viewBox="-0.5 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#f2f2f2"
          className="w-7 h-7"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M3 21.32L21 3.32001"
              stroke="#e3e3e3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 3.32001L21 21.32"
              stroke="#e3e3e3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      ) : (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M20 7L4 7"
              stroke="#e3e3e3"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M20 12L4 12"
              stroke="#e3e3e3"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M20 17L4 17"
              stroke="#e3e3e3"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      )}
    </Button>
  );
}
