"use client";
import { InputHTMLAttributes, ReactNode, useState } from "react";
import { ChangeEvent, KeyboardEvent } from "react";
import Button from "./Button";
import { twMerge } from "tailwind-merge";

type Props = InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => any;
	onReset: () => void;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => any;
	ref?: React.Ref<HTMLInputElement>;
};

export default function Input({
	className,
	onChange,
	onReset,
	value,
	ref,
	...props
}: Props) {
	function handleReset() {
		onReset();
	}

	return (
		<div className="relative z-[0] w-[80%]">
			{value && (
				<ResetButton
					onReset={handleReset}
					className={
						"bg-transparent hover:bg-dark hover:text-white px-3 text-dark text-xl border-none absolute right-0"
					}
				/>
			)}
			<input
				ref={ref}
				className="text-xl rounded-full py-1 px-10 bg-white text-black w-full text-center"
				value={value}
				onChange={(e) => onChange(e)}
				{...props}
			/>
		</div>
	);
}

function ResetButton({
	onReset,
	className,
}: {
	onReset: () => void;
	className: string;
}) {
	return (
		<Button className={twMerge(className)} onClick={onReset}>
			X
		</Button>
	);
}
