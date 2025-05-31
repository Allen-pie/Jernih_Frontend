'use client'

import React, { useEffect, useState } from 'react'
import { UserIcon, SendIcon, MessageCircleIcon } from 'lucide-react'
import { fetchCommentById, postComment } from '@/utils/supabase/comment'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Comments {
    id? : number;
    article_id? : number;
    user_id? : number;
    created_at? : string;
    text? : string;
    username? : string;
}

interface CommentSectionProps {
  articleId: number
}

export const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const [comments, setComments] = useState<Comments[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await fetchCommentById(articleId)
      setComments(fetchedComments)
    }

    const fetchUser = async () => {
        const {
        data: { user },
        error
        } = await supabase.auth.getUser()
        if (!error) setUser(user)
    }

    fetchComments()
    fetchUser()
  }, [articleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return;

    try {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            console.error('User not authenticated: ', userError)
            toast({
                title: 'Login Diperlukan',
                description: 'Mohon log in terlebih dahulu untuk menambahkan komentar',
                variant: 'destructive'
            })
            return
        }

        const newPostedComment = await postComment(articleId, user.id, newComment)

        toast({
            title: 'Komentar Dibuat',
            description: 'Komentar berhasil dibuat.',
            variant: 'success'
        })

        setComments((prev) => [...prev, newPostedComment])
        setNewComment('')
    } catch (error) {
        console.log('Gagal untuk membuat komen: ', error)
        toast({
            title: 'Komen Gagal',
            description: 'Gagal membuat komen. Coba lagi nanti.',
            variant: 'destructive'
        })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <MessageCircleIcon size={24} className="mr-2 text-blue-500" />
        Komentar
      </h3>

      {comments.length > 0 ? (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 mr-2">
                  <UserIcon size={16} />
                </div>
                <span className="font-medium text-blue-800">
                  {comment.username}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 italic mb-8">
            Belum ada komentar. Jadilah yang pertama berbagi pendapat Anda!
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                Komentar Anda
            </label>
            <textarea
                id="comment"
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Bagikan pemikiran Anda..."
                required
            />
            </div>
            <button
                type="submit"
                disabled={!newComment.trim()}
                className={`inline-flex items-center px-4 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                    ${!newComment.trim() 
                    ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                `}
            >
            <SendIcon size={18} className="mr-2" />
            Buat Komentar
            </button>
        </form>
        ) : (
        <div className="text-center text-sm text-gray-600">
            <p>Anda harus <Link href={`/login`} className="text-blue-600 underline">login</Link> untuk menulis komentar.</p>
        </div>
        )}
    </div>
  )
}
