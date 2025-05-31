import { Comment } from '@/app/interfaces'
import { supabase } from './client'

export async function fetchCommentById(id: number | string) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      article_id,
      user_id,
      text,
      created_at,
      profiles ( full_name )
    `)
    .eq('article_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error(`Error fetching comments with article_id ${id}:`, error)
    return []
  }

  const comments = data as Comment[];

  return comments.map((comment) => ({
    id: comment.id,
    article_id: comment.article_id,
    user_id: comment.user_id,
    text: comment.text,
    created_at: comment.created_at,
    username: comment.profiles?.full_name || 'Anonymous',
  }))
}

export async function postComment(article_id: number, user_id: string, text: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      { article_id, user_id, text }
    ])
    .select(`
      id,
      article_id,
      user_id,
      text,
      created_at,
      profiles ( full_name )
    `)
    .single()

  if (error) {
    console.error('Error posting comment:', error)
    throw error
  }

  const newComment = data as Comment;

  return {
    id: newComment.id,
    article_id: newComment.article_id,
    user_id: newComment.user_id,
    text: newComment.text,
    created_at: newComment.created_at,
    username: newComment.profiles?.full_name || 'Anonymous',
  }
}