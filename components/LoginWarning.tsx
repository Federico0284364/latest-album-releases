import { ReactNode } from "react";
import Card from "./Card";

type Props = {
	children: ReactNode;
};

export default function LogInWarning({ children }: Props) {
	return (
		<Card className="block mx-auto px-6 py-4 text-center max-w-max bg-danger/30 rounded border-1 border-danger">
			{children}
		</Card>
	);
}
