'use client'
import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof motion.button> & ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: ReactNode;
	className?: string;
	variant?: 'primary' | 'secondary' | 'danger' | 'important';
	size?: 'sm' | 'md' | 'lg' | 'xl';
};

export default function Button({
	children,
	variant = "secondary",
	size = "md",
	className,
	...props
}: Props) {

  const standardClass = 'rounded-full hover:opacity-90 active:opacity-80'

	const variantClass = {
    secondary: 'bg-dark text-fg border-fg border',
    primary: 'bg-fg text-dark',
    danger: 'bg-red-500 text-white',
		important: 'bg-important text-fg',
  }[variant];

  const sizeClass = {
    sm: 'text-sm px-1 py-0',
    md: 'text-md px-2 py-1',
    lg: 'text-xl px-4 py-2',
    xl: 'text-2xl px-6 py-3 font-semibold',
  }[size];

	return (
		<motion.button className={twMerge(standardClass, variantClass, sizeClass, className)} {...props}>
			{children}
		</motion.button>
	);
}
