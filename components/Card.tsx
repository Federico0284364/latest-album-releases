import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion, MotionProps } from "framer-motion";

type Props = MotionProps & React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Card({ className, children, ...props }: Props) {
	return (
		<motion.div
			className={twMerge(
				"p-4 bg-medium rounded-lg flex flex-col gap-8 w-full",
				className
			)}
			{...props}
		>
			{children}
		</motion.div>
	);
}
