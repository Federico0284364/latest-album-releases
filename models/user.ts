import { User } from "firebase/auth";
import { Artist } from "./artist";

export type MyUser = User & {
  followedArtists?: Artist[]
  name?: string
}