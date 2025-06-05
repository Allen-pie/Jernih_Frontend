"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, User } from "lucide-react"
import { fetchArticlesAdmin } from "@/utils/supabase/article";
import { ArticleAdmin } from "@/app/interfaces"
import { useEffect, useState } from "react";

export default  function ArticlesPage() {
    const [articles, setArticles] = useState<ArticleAdmin[]>([]);

   useEffect(() => {
        const fetchArticles = async () => {     
            try {
                const articles = await fetchArticlesAdmin();
                setArticles(articles);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        }
        fetchArticles();
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1">
                <main className="flex-1 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Artikel</h1>
                            <p className="text-muted-foreground mt-1">
                                Kelola dan buat konten edukasi tentang konservasi air
                            </p>
                        </div>
                        <Link href="create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Artikel
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {articles.map((article) => (
                            <Card key={article.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <CardTitle className="text-xl">{article.title}</CardTitle>
                                            <CardDescription>{article.excerpt}</CardDescription>
                                        </div>
                                        <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <User className="mr-1 h-4 w-4" />
                                            {article.author}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            {article.created_at ? new Date(article.created_at).toLocaleDateString() : "Unknown"}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="mr-1 h-4 w-4" />
                                            {article.published_at === "Belum Dipublikasikan"
                                                ? article.published_at
                                                : article.published_at
                                                    ? new Date(article.published_at).toLocaleDateString()
                                                    : "Unknown"}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`${article.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                Ubah
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm">
                                            Lihat
                                        </Button>
                                    </div>
                                </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}