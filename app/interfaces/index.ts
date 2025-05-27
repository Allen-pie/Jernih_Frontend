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


export interface Asset {   
    path : string;
}
