import { Album } from "./album";

export interface Artist {
    external_urls: ExternalUrls;
    followers:     Followers;
    genres:        string[];
    href:          string;
    id:            string;
    images:        Image[];
    name:          string;
    popularity:    number;
    type:          string;
    uri:           string;
    albums: Album[];
}

export interface ExternalUrls {
    spotify: string;
}

export interface Followers {
    href:  null;
    total: number;
}

export interface Image {
    url:    string;
    height: number;
    width:  number;
}
