import { User } from "firebase/auth";
import { Artist } from "./artist";
import type { Settings } from "./settings";

export type MyUser = User & {
  uid: string,
  displayName: string,
  email: string,
  followedArtists: Artist[];
  settings: Settings
}