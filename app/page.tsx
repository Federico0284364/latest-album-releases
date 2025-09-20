
import FollowedArtists from "@/components/FollowedArtists";
import CustomLogin from "@/components/CustomLogin";
import Link from "next/link";
import MainSection from "@/components/MainSection";
import StoreProvider from "@/store/StoreProvider";

export default function Home() {

	return (
		<>
		
			<main className="w-full h-full flex flex-col items-center text-white">
				<section className="flex w-full justify-center mt-12">
					<div className="flex flex-col items-center w-[90%] max-w-140 gap-4">
						<h1 className="text-xl">Search an artist</h1>
						<MainSection />
					</div>
					
				</section>
			</main>
		</>
	);
}
