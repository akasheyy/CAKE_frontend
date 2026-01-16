import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from "@/api/cakeApi";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
  category: string;
  createdAt: string;
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState("general");

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* 🔐 Admin Guard */
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  /* 📸 Fetch Gallery Images */
  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await getGalleryImages();
        setImages(data);
      } catch (error) {
        console.error("Failed to load gallery images", error);
        toast({
          title: "Error",
          description: "Failed to load gallery images",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("alt", altText || "Gallery Image");
      formData.append("category", category);

      const result = await uploadGalleryImage(formData);

      setImages([result.image, ...images]);
      setSelectedFile(null);
      setAltText("");
      setCategory("general");

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await deleteGalleryImage(imageId);
      setImages(images.filter(img => img._id !== imageId));
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg font-medium animate-pulse text-slate-500">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gallery Management</h1>
            <p className="text-slate-500 mt-1">Upload and manage gallery images ({images.length})</p>
          </div>
          <Badge variant="outline" className="w-fit bg-white px-4 py-1 text-sm shadow-sm">
            Status: Active
          </Badge>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload New Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="image">Image File</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., wedding, birthday"
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full md:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-400">No images uploaded yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <Card key={image._id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image._id)}
                      className="w-8 h-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-medium truncate">{image.alt}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {image.category}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
