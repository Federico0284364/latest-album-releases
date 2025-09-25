import Image from "next/image";
import { twMerge } from "tailwind-merge";

type Props = {
	href: string;
	text?: string;
	width?: number;
	height?: number;
	className?: string;
  variant?: 'green' | 'black' | 'white'
};

export default function SpotifyLogo({ href, text, width, height, className, variant = 'green' }: Props) {
  const logoMap: Record<string, string> = {
  green: "/Full_Logo_Green_RGB.svg",
  black: "/Full_Logo_Black_CMYK.svg",
  white: "/Full_Logo_White_CMYK.svg",
};

const imgSrc = logoMap[variant];

	return (
		<a className={twMerge("block", className)} href={href} target="_blank">
      <span>{text}</span>
			<Image
				src={imgSrc}
				alt="Spotify logo"
				width={width ?? 100}
				height={height ?? 100}
			/>
		</a>
	);
}
