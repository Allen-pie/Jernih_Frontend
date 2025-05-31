import { Article, Asset } from '@/app/interfaces';
import {supabase, supabaseUrl} from './client'
import { AriaAttributes } from 'react';
import { BUCKET_URLS } from '@/url/bucket_url';

export async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      created_at,
      title,
      excerpt,
      content,
      author,
      image_id,
      assets:assets!articles_image_id_fkey (
        path
      )
    `);

  if (error) {
    console.error('Error fetching articles:', error)
    return [];
  }

  
  // @ts-ignore
  const articles = data as Article[];
  
  const articlesWithComments = await Promise.all(
    articles.map(async (article) => {
      const commentCount = await countCommentsByArticleId(article.id)
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
    image_url: article.assets ? `${BUCKET_URLS.main}/article-images/${article.assets.path}` : "",
    author: article.author,
    date: article.created_at,
    comment_count: article.commentCount,
  }));


}

export async function fetchArticleById(id: number | string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      created_at,
      title,
      excerpt,
      content,
      author,
      image_id,
      assets:assets!articles_image_id_fkey (
        path
      )
    `)
    .eq('id', id)  
    .single<Article>();

  if (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    return null;
  }

  const article = data as Article;
  return{
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    image_url: article.assets ? `${BUCKET_URLS.main}/article-images/${article.assets.path}` : "",
    author: article.author,
    date: article.created_at,
    content: data.content,
  };
}

export const countCommentsByArticleId = async (articleId: number): Promise<number> => {
  const { data, error, count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)

  if (error) {
    console.error('Error counting comments:', error)
    return 0
  }

  return count || 0
}