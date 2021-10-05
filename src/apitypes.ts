export interface APIDoujin {
    id: number;
    media_id: string;
    title: {
        english: string;
        japanese: string;
        pretty: string;
    };
    images: {
        pages: APIImage[];
        cover: APIImage;
        thumbnail: APIImage;
    };
    scanlator: string;
    upload_date: number;
    tags: APITag[];
    num_pages: number;
    num_favorites: number;
}

export type APITagType = 'tag' | 'group' | 'language' | 'artist' | 'character' | 'parody' | 'category';

export interface APITag {
    id: number;
    type: APITagType;
    name: string;
    url: string;
    count: number;
}

export interface APIImage {
    t: 'g' | 'j' | 'p';
    w: number;
    h: number;
}

export interface APISearchResult {
    result: APIDoujin[];
    num_pages: number;
    per_page: number;
}

export interface APIComment {
    id: number;
    gallery_id: number;
    poster: APICommentAuthor;
    post_date: number;
    body: string;
}

export interface APICommentAuthor {
    id: number;
    username: string;
    slug: string;
    avatar_url: string;
    is_superuser: boolean;
    is_staff: boolean;
}
