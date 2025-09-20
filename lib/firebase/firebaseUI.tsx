/* "use client";

import React, { useEffect, useRef } from "react";
import firebase from "./initialize-firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useRouter } from "next/navigation";

export default function FirebaseUI() {
	const uiRef = useRef(null);
	const router = useRouter();

	useEffect(() => {
		const ui =
			firebaseui.auth.AuthUI.getInstance() ||
			new firebaseui.auth.AuthUI(firebase.auth());

			
		ui.start("#firebaseui-auth-container", {
			signInOptions: [
				{
					provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				},
				{
					provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
					signInMethod:
						firebase.auth.EmailAuthProvider
							.EMAIL_LINK_SIGN_IN_METHOD,

					requireDisplayName: false,
				},
				
			],
			callbacks: {
        signInSuccessWithAuthResult: () => {
          return false; // Evita redirect
        },
      },
		});

		const unregisterAuthObserver = firebase
			.auth()
			.onAuthStateChanged((user) => {
				console.log("Auth state changed:", user);
				if (user) {
					console.log("✅ Login avvenuto con:", user.email);
					
				}
			});

		return () => {
			ui.reset();
			unregisterAuthObserver();
		};
	}, []);

	return <div id="firebaseui-auth-container" ref={uiRef}></div>;
}
 */