import React from "react";
import { ArticleCard } from "@/components/article-card";
import { articles } from "@/utils/tempArticleData";
import { Footer } from "@/components/footer";

export default function ArticlesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Articles
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Dive into our collection of articles related to water pollution and
            more
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="mr-2 text-blue-500" />
            Latest Articles
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              excerpt={article.excerpt}
              imageUrl={article.imageUrl}
              author={article.author}
              date={article.date}
              commentCount={article.comments.length}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
