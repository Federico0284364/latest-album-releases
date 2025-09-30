"use client";

import { useSpotifyStore } from "@/store/store";
import { ReactNode } from "react";
import type { Settings } from "@/models/settings";
import { saveSettingsToDb } from "@/lib/firebase/database-functions/settingFunctionsToDb";
import LogoutButton from "./CustomLogoutButton";

type SectionProps = {
	title: string;
	children: ReactNode;
};

type SettingProps<
	S extends keyof Settings = keyof Settings,
	K extends keyof Settings[S] = keyof Settings[S]
> = {
	settingSection: S;
	settingKey: K;
	settingValue: Settings[S][K];
	name: string;
	description?: string;
	type: "checkbox" | "select";
	options?: string[];
	onChange: (section: S, key: K, value: Settings[S][K]) => void;
};

export default function Settings() {
	const user = useSpotifyStore((state) => state.user);
	const settings = useSpotifyStore((state) => state.settings);
	const updateSetting = useSpotifyStore((state) => state.updateSetting);

	async function handleSettingChange<
		S extends keyof Settings,
		K extends keyof Settings[S]
	>(section: S, key: K, value: Settings[S][K]) {
		if (!user) return;

		updateSetting(section, key, value);
		await saveSettingsToDb(user.uid, section, key, value);
	}

	return (
		<>
			<Section title={"E-mails"}>
				<Setting
					settingSection={"email"}
					settingKey={"weeklyEmails"}
					settingValue={settings?.email?.weeklyEmails ?? false}
					name={"Weekly emails"}
					description={
						"Enable to receive weekly e-mails about new releases from your favorite artists."
					}
					type="checkbox"
					onChange={handleSettingChange}
				/>

				{settings.email.weeklyEmails && <Setting
					settingSection={"email"}
					settingKey={"singles"}
					settingValue={settings?.email?.singles ?? false}
					name={"Singles/EP"}
					description={
						"Enable to receive e-mails about new singles, EPs and albums. If you disable this option, you will only be notified about new albums."
					}
					type="checkbox"
					onChange={handleSettingChange}
				/>}
			</Section>
			{user && <LogoutButton />}
		</>
	);
}

function Section({ title, children }: SectionProps) {
	return (
		<section>
			<h2 className="text-2xl mb-2">{title}</h2>
			{children}
			<hr className="border-t border-dashed border-border-muted my-4"></hr>
		</section>
	);
}

export function Setting<S extends keyof Settings, K extends keyof Settings[S]>({
	settingSection,
	settingKey,
	settingValue,
	name,
	description,
	type = "checkbox",
	options = [],
	onChange,
}: SettingProps<S, K>) {
	if (type === "checkbox") {
		if (typeof settingValue !== "boolean") {
			throw new Error("Error with checkbox settings: " + name);
		}

		return (
			<div className="flex flex-col mb-4">
				<label className="inline-flex items-center space-x-2">
					<span className="text-fg/80 mr-4">{name}</span>
					<input
						type="checkbox"
						checked={settingValue}
						className="form-checkbox h-5 w-5 text-blue-600"
						onChange={(e) =>
							onChange(
								settingSection,
								settingKey,
								e.target.checked as Settings[S][K]
							)
						}
					/>
				</label>
				{description && (
					<p className="text-gray-500 text-sm">{description}</p>
				)}
			</div>
		);
	}

	if (type === "select") {
		if (typeof settingValue !== "string") {
			throw new Error("Error with select settings: " + name);
		}

		return (
			<div className="flex flex-col mb-4">
				<label className="text-gray-800 font-medium mb-1">{name}</label>
				<select
					value={settingValue as string}
					className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					onChange={(e) =>
						onChange(
							settingSection,
							settingKey,
							e.target.value as Settings[S][K]
						)
					}
				>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
				{description && (
					<span className="text-gray-500 text-sm mt-1">
						{description}
					</span>
				)}
			</div>
		);
	}

	return null;
}
