import type { Album } from "@/models/album";

export const filterAlbumsBy = {
  album_type: (albums: Album[], album_type: '' | 'album' | 'single' | 'compilation' = ''): Album[] => {
    if (!albums) return [];
    if (!album_type) return albums;

    return albums.filter((album) => album.album_type === album_type) 
  }
}

