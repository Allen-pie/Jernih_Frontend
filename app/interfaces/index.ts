export interface Article {
    id? : number;
    title?: string;
    excerpt?: string;
    author?: string;
    date?: string;
    comment_count ?:number;
    assets? : Asset;
    created_at?: string;
    content? : string;
    image_url? : string;
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
