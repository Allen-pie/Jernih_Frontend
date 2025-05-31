import React from 'react'
import Link from "next/link"
import Image from "next/image";
import { CommentSection } from '@/components/comment-section';
import { fetchArticleById } from '@/utils/supabase/article';
import { ArrowLeftIcon, CalendarIcon, UserIcon, ClockIcon } from 'lucide-react'
import { ArticleGuest } from '@/app/interfaces';

interface Props {
  params: {
    id: string;
  };
}

const ArticleDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const articleId = parseInt(id);
  const article : ArticleGuest = await fetchArticleById(articleId);

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Artikel tidak ditemukan
          </h1>
          <p className="mb-8">
            Artikel yang kamu cari tidak ada atau sudah dihapus.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src={article.image_url}
          alt={article.title ?? ""}
          fill
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Link
            href="/articles"
            className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Kembali
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center text-blue-100 gap-4">
            <div className="flex items-center">
              <UserIcon size={16} className="mr-1" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon size={16} className="mr-1" />
              <span>{article.published_at}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon size={16} className="mr-1" />
              <span>{Math.ceil((article.content ?? "").split(' ').length / 200)} menit baca</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-xl text-gray-700 mb-6 font-medium italic">
              {article.excerpt}
            </p>
            <div dangerouslySetInnerHTML={ { __html: article.content } } className="prose ql-editor [&>blockquote]:border-l-4 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600">
            </div>
          </div>
          <div className="border-t border-gray-200 pt-10">
            <CommentSection
              articleId={article.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
