import React from 'react'
import Link from "next/link"
import Image from "next/image";
// import { articles } from '@/utils/tempArticleData'
import { fetchArticleById } from '@/supabase';
import { ArrowLeftIcon, CalendarIcon, UserIcon, ClockIcon } from 'lucide-react'

interface Props {
  params: {
    id: string;
  };
}

const ArticleDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const articleId = parseInt(id || '1', 10);
  // const article = articles.find((article) => article.id === articleId);
  const article = await fetchArticleById(articleId);

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Article Not Found
          </h1>
          <p className="mb-8">
            The article you`&apos;`re looking for doesn`&apos;`t exist or has been removed.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
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
            Back to Articles
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
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon size={16} className="mr-1" />
              <span>{Math.ceil(article.content.split(' ').length / 200)} min read</span>
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
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
