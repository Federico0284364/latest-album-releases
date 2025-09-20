'use client'
import { useState } from "react";
import { ChangeEvent } from "react";

type Props = {
	className?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;

};

export default function Input({ className, onChange, value }: Props) {
	return (
		<input
			className="text-xl rounded-full py-1 px-2 bg-white text-black w-[90%] text-center"
			value={value}
			onChange={(e) => onChange(e)}
		/>
	);
}
