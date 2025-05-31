import React from 'react'
import Link from "next/link"
import Image from "next/image";
import { MessageSquareIcon, CalendarIcon, UserIcon } from 'lucide-react'

interface ArticleCardProps {
  id?: number
  title?: string
  excerpt?: string
  imageUrl?: string
  author?: string
  date?: string
  commentCount?: number
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  imageUrl,
  author,
  date,
  commentCount,
}) => {
  return (
    <Link
      href={`/articles/${id}`}
      className="group flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-white hover:translate-y-[-5px]"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl ?? ""}
          alt={title ?? "card-image"}
          fill
          priority
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
      </div>
      <div className="flex-grow flex flex-col p-5 border-t-4 border-blue-400">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <div className="mt-auto">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <UserIcon size={14} className="mr-1" />
            <span>{author}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center"> 
              <CalendarIcon size={14} className="mr-1" />
              <span>
                {date ? new Date(date).toLocaleDateString() : ('unknown')}
              </span>
            </div>
            <div className="flex items-center">
              <MessageSquareIcon size={14} className="mr-1" />
              <span>{commentCount} komentar</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
