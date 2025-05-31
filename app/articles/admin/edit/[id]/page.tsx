"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { QuillEditor } from "@/components/quill-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Loader2} from "lucide-react"
import { createArticle } from "@/utils/supabase/article"
import { supabase } from "@/utils/supabase/client"
import { fetchArticleById } from "@/utils/supabase/article"
import { ArticleGuest } from "@/app/interfaces"

interface Props {
  params: {
    id: string;
  };
}

const EditArticle = ({ params }: Props) =>  {
    const [title, setTitle] = useState("")
    const [excerpt, setExcerpt] = useState("")
    const [content, setContent] = useState("")
    const [featuredImage, setFeaturedImage] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState("")
    const [isPublished, setIsPublished] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState("")
    
    const router = useRouter()

    const fetchArticle = async() => {
        const { id } = await params;
        const articleId = parseInt(id);
        const article : ArticleGuest = await fetchArticleById(articleId);
        
        console.log(article)
        setTitle(article.title!)
        setExcerpt(article.excerpt!)
        setContent(article.content!)
        setImageUrl(article.image_url!)
        setStatus(article.status!)
        setIsPublished(article.status === 'published' ? true : false)
    }

    useEffect( () => {
        fetchArticle();
    }, [])

  const handleImageUpload = async () => {
    const file = featuredImage

    if (!file) return;

    const safeFileName = `article-images/${file.name}`

    const { data, error } = await supabase.storage
      .from("jernih")
      .upload(safeFileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
    });
    console.log(data)
    const { data: db_data, error: db_error } = await supabase
      .from("assets")
      .insert({
        path: data!.path,
      })
      .select();

    if (error) {
      console.error("Upload Image Failed: ", error.message);
      return null;
    } else {
      console.log("Upload Image Success: ", data);
    }

    if (db_error) {
      console.error("Saving Original Image to DB Failed: ", db_error.message);
      return null;
    }

    const asset_result = db_data!;
    return asset_result[0].id;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setFeaturedImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the title and content before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

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

        const image_id = await handleImageUpload()

        await createArticle(title, excerpt, content, user.id, image_id, isPublished ? 'published' : 'draft')

      toast({
        title: isPublished ? "Article published" : "Article saved",
        description: isPublished
          ? "Your article has been published successfully!"
          : "Your article has been saved as a draft.",
      })

      router.push("/articles/admin")
    } catch (error) {
        console.log('Error: ', error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-8">
          <LoadingOverlay isLoading={isSubmitting} message="Publishing article..." />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">EditArticle</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/articles/admin">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                    <CardDescription>Editor your article</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter article title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief description of your article (optional)"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content *</Label>
                      <QuillEditor value={content} onChange={setContent} placeholder="Start writing your article..." />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Publish Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="publish-toggle">Publish immediately</Label>
                      <Switch id="publish-toggle" checked={isPublished} onCheckedChange={setIsPublished} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isPublished
                        ? "Article will be published and visible to all users"
                        : "Article will be saved as a draft"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input type="file" accept="image/*" onChange={handleImageChange} />
                      <p className="text-sm text-muted-foreground">
                        Upload a featured image for your article (optional)
                      </p>
                      { imageUrl && (
						<div className="">
							<img
								src={imageUrl|| '@/public/assets/jernihLogo.svg'}
								alt="Original image"
								className="max-w-full object-contain p-4"
							/>
						</div>
					  )}
                      {featuredImage && <p className="text-sm text-primary">Selected: {featuredImage.name}</p>}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isPublished ? "Publishing..." : "Saving..."}
                      </>
                    ) : isPublished ? (
                      "Publish Article"
                    ) : (
                      "Save Article"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default EditArticle;