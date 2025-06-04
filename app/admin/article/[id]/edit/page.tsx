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
import { ImageIcon, Loader2, Upload} from "lucide-react"
import { updateArticle } from "@/utils/supabase/article"
import { supabase } from "@/utils/supabase/client"
import { fetchArticleById } from "@/utils/supabase/article"
import { ArticleGuest } from "@/app/interfaces"
import { ImagePreview } from "@/components/image-preview"

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
    //const [status, setStatus] = useState("")
    const [dragActive, setDragActive] = useState(false)
    const [isImageChanged, setImageChanged] = useState<boolean>(false);
    
    const router = useRouter()

    const fetchArticle = async() => {
        const { id } = await params;
        const articleId = parseInt(id);
        const article = await fetchArticleById(articleId) as ArticleGuest;
        
        console.log(article)
        setTitle(article.title!)
        setExcerpt(article.excerpt!)
        setContent(article.content!)
        setImageUrl(article.image_url!)
        //setStatus(article.status!)
        setIsPublished(article.status === 'published')
    }

    useEffect( () => {
        fetchArticle();
    }, [])

  const handleImageUpload = async () => {
    const file = featuredImage

    if (!file) return;

    const safeFileName = `article-images/${Date.now()}.png`

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
      setImageUrl("");
      setFeaturedImage(file)
      setImageChanged(true)
    }
    
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Field yang diperlukan belum terisi",
        description: "Harap isi Judul sebelum mengirim.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Field yang diperlukan belum terisi",
        description: "Harap isi Konten sebelum mengirim.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
        let image_id = null;
        let published_at = null;
        
        if (isImageChanged) image_id = await handleImageUpload() 
         
        if (isPublished) published_at = new Date().toISOString();

        const { id } = await params;
        const articleId = parseInt(id)

        await updateArticle(
          articleId,
          published_at,
          title,
          excerpt,
          content,
          image_id ?? null,
          isPublished ? 'published' : 'draft'
        );
      

      toast({
        title: isPublished ? "Artikel Diperbarui" : "Artikel Disimpan",
        description: isPublished
          ? "Artikel telah berhasil dipublikasikan!"
          : "Artikel telah disimpan sebagai draft.",
      })

      router.push("/admin/article/all")
    } catch (error) {
        console.log('Error: ', error)
      toast({
        title: "Submit gagal",
        description: "Terjadi kesalahan saat mengirimkan artikel. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Jenis file tidak valid",
          description: "Harap pilih file gambar.",
          variant: "destructive",
        })
        return
      }

    
      setFeaturedImage(file)
      toast({
        title: "Gambar Diunggah",
        description: "Gambar telah ditambahkan ke artikel.",
      })
    }
  }


  const handleRemoveImage = () => {
    setFeaturedImage(null);
    setImageUrl("");
  }

  const renderPreviewImg = () => {
      if (imageUrl && !featuredImage){
        return (
          <ImagePreview onRemove={handleRemoveImage} file_url={imageUrl}/>

        )
      }else if (!imageUrl && featuredImage){
        return (
          <ImagePreview onRemove={handleRemoveImage} file={featuredImage}/>
        )
      }

      return null;
  }

 
 
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-6 md:p-8">
          <LoadingOverlay isLoading={isSubmitting} message="Publishing article..." />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ubah Artikel</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/article/all">
                <Button variant="outline">Batal</Button>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Isi Artikel</CardTitle>
                    <CardDescription>Ubah Artikel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Judul *</Label>
                      <Input
                        id="title"
                        placeholder="Enter article title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Kutipan *</Label>
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
                      <Label>Konten *</Label>
                      <QuillEditor value={content} onChange={setContent} placeholder="Mulai menulis artikel..." />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pengaturan Publikasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="publish-toggle">Publikasikan Segera</Label>
                      <Switch id="publish-toggle" checked={isPublished} onCheckedChange={setIsPublished} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isPublished
                        ? "Artikel akan dipublikasikan dan terlihat oleh semua pengguna"
                        : "Artikel akan disimpan sebagai draft"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {renderPreviewImg()}
                        
                    {!imageUrl && !featuredImage && (
                      
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Letakkan gambar Anda di sini, atau klik untuk menjelajah</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF hingga 5MB</p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="featured-image-input"
                        />
                        <Label htmlFor="featured-image-input" className="cursor-pointer">
                          <Button type="button" variant="outline" className="mt-4" asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              Pilih Gambar
                            </span>
                          </Button>
                        </Label>
                      </div>
                    )}

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
                      "Publikasikan Artikel"
                    ) : (
                      "Simpan Artikel"
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