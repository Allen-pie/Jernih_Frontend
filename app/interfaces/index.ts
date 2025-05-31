export interface ArticleGuest {
    id? : number;
    published_at?: string;
    title?: string;
    excerpt?: string;
    author?: string;
    comment_count ?:number;
    assets? : Asset;
    content? : string;
    image_url? : string;
}

export interface ArticleAdmin {
    id? : number;
    title?: string;
    excerpt?: string;
    author?: string;
    created_at?: string;
    published_at?: string;
    comment_count ?:number;
    assets? : Asset;
    content? : string;
    image_url? : string;
    status?: string;
}

export interface Comment {
    id? : number;
    article_id? : number;
    user_id? : number;
    created_at? : string;
    text? : string;
    profiles? : {
        full_name?: string;
    }
}

export interface Asset {   
    path : string;
}
