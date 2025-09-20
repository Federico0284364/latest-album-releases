export interface AlbumCollection {
    href:     string;
    limit:    number;
    next:     string;
    offset:   number;
    previous: null;
    total:    number;
    items:    Album[];
}

export interface Album {
    album_type:             AlbumGroup;
    total_tracks:           number;
    available_markets:      string[];
    external_urls:          ExternalUrls;
    href:                   string;
    id:                     string;
    images:                 Image[];
    name:                   string;
    release_date:           Date;
    release_date_precision: ReleaseDatePrecision;
    type:                   AlbumGroup;
    uri:                    string;
    artists:                Artist[];
    album_group:            AlbumGroup;
}

export enum AlbumGroup {
    Album = "album",
    Single = "single",
}

export interface Artist {
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    name:          string;
    type:          Type;
    uri:           string;
}

export interface ExternalUrls {
    spotify: string;
}

export enum Type {
    Artist = "artist",
}

export interface Image {
    url:    string;
    height: number;
    width:  number;
}

export enum ReleaseDatePrecision {
    Day = "day",
}
