import { ArticleGuest, ArticleAdmin } from '@/app/interfaces';
import {supabase} from './client'
// import { AriaAttributes } from 'react';
import { BUCKET_URLS } from '@/url/bucket_url';

export async function fetchArticlesGuest() {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      published_at,
      title,
      excerpt,
      content,
      author,
      image_id,
      assets:assets!articles_image_id_fkey (
        path
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .returns<ArticleGuest[]>();

  if (error) {
    console.error('Error fetching articles:', error)
    return [];
  }

  
  const articles = data as ArticleGuest[];
  
  const articlesWithComments = await Promise.all(
    articles.map(async (article) => {
      const commentCount = await countCommentsByArticleId(article.id!)
      return {
        ...article,
        commentCount
      }
    })
  )

  return articlesWithComments.map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt, 
    image_url: article.assets ? `${BUCKET_URLS.main}/${article.assets.path}` : "",
    author: article.author,
    published_at: (article.published_at)?.replace('T', ' ').substring(0, 19),
    comment_count: article.commentCount,
  }));
}

export async function fetchArticlesAdmin() {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      created_at,
      published_at,
      title,
      excerpt,
      content,
      author,
      image_id,
      assets:assets!articles_image_id_fkey (
        path
      ),
      status
    `)
    .order('created_at', { ascending: false })
    .returns<ArticleAdmin[]>();

  if (error) {
    console.error('Error fetching articles:', error)
    return [];
  }

  const articles = data as ArticleAdmin[];
  
  const articlesWithComments = await Promise.all(
    articles.map(async (article) => {
      const commentCount = await countCommentsByArticleId(article.id!)
      return {
        ...article,
        commentCount
      }
    })
  )

  return articlesWithComments.map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt, 
    image_url: article.assets ? `${BUCKET_URLS.main}/${article.assets.path}` : "",
    author: article.author,
    created_at: (article.created_at)?.replace('T', ' ').substring(0, 19),
    published_at: article.published_at ? (article.published_at)?.replace('T', ' ').substring(0, 19) : 'Belum Dipublikasikan',
    comment_count: article.commentCount,
    status: article.status
  }));
}

export async function fetchArticleById(id: number | string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      created_at,
      published_at,
      title,
      excerpt,
      content,
      author,
      image_id,
      assets:assets!articles_image_id_fkey (
        path
      ),
      status
    `)
    .eq('id', id)
    .single<ArticleGuest>();

  if (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    return null;
  }

  const article = data as ArticleGuest;
  return{
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    image_url: article.assets ? `${BUCKET_URLS.main}/${article.assets.path}` : "",
    author: article.author,
    published_at: (article.published_at)?.replace('T', ' ').substring(0, 19),
    content: article.content,
    status: article.status
  };
}

export const countCommentsByArticleId = async (articleId: number): Promise<number> => {
  const { error, count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)

  if (error) {
    console.error('Error counting comments:', error)
    return 0
  }

  return count || 0
}

export async function getUsername(user_id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      full_name
    `)
    .eq('id', user_id)
    .single()

  if (error) {
    console.error(`Error fetching user with id ${user_id}:`, error);
    return null;
  }

  return { username: data.full_name }
}

export async function createArticle(title: string, excerpt: string, content: string, user_id: string, image_id: number, status: string) {
  const usernameRaw = await getUsername(user_id)
  const username = usernameRaw?.username

  const { error } = await supabase
    .from('articles')
    .insert({
      title: title,
      excerpt: excerpt,
      content: content,
      author: username,
      image_id: image_id,
      status: status,
      published_at: status === 'draft' ? null : new Date(Date.now())
    })

  if (error) {
    console.log('Error saving articles.', error)
  }
}

export const updateArticle = async (
  id: number,
  published_at: string | null,
  title: string,
  excerpt: string,
  content: string,
  image_id: number | null,
  status: string
) => {

  if (image_id === null) {
    if (published_at === '') {
      const { error } = await supabase
        .from("articles")
        .update({
          title,
          excerpt,
          content,
          status,
        })
        .eq("id", id);
  
      if (error) throw error;
    }
    else {
      const { error } = await supabase
        .from("articles")
        .update({
          published_at,
          title,
          excerpt,
          content,
          status,
        })
        .eq("id", id);
  
      if (error) throw error;
    }
  }
  else {
    if (published_at === '') {
      const { error } = await supabase
        .from("articles")
        .update({
          title,
          excerpt,
          content,
          image_id,
          status,
        })
        .eq("id", id);
  
      if (error) throw error;
    }
    else {
      const { error } = await supabase
        .from("articles")
        .update({
          published_at,
          title,
          excerpt,
          content,
          image_id,
          status,
        })
        .eq("id", id);
  
      if (error) throw error;
    }
  }

};