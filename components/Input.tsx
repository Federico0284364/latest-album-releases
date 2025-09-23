'use client'
import { useState } from "react";
import { ChangeEvent, KeyboardEvent } from "react";

type Props = {
	className?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => any;
	onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => any;
};

export default function Input({ className, onChange, value, ...props }: Props) {
	return (
		<input
			className="text-xl rounded-full py-1 px-2 bg-white text-black w-[90%] text-center"
			value={value}
			onChange={(e) => onChange(e)}
			{...props}
		/>
	);
}
