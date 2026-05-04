"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useCourses } from "@/contexts/courses-context"
import { ArrowLeft, Plus, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Lesson {
  id: string
  title: string
  duration: string
  type: "article"
  content?: string
}

export default function CreateCoursePage() {
  const router = useRouter()
  const { addCourse } = useCourses()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [instructor, setInstructor] = useState("")
  const [duration, setDuration] = useState("")
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [image, setImage] = useState("")
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [uploading, setUploading] = useState(false)
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number | null>(null)

  const addLesson = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: "",
      duration: "",
      type: "article",
      content: "",
    }
    setLessons([...lessons, newLesson])
  }

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index))
  }

  const updateLesson = (index: number, field: keyof Lesson, value: string) => {
    const updatedLessons = [...lessons]
    updatedLessons[index] = { ...updatedLessons[index], [field]: value }
    setLessons(updatedLessons)
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setImage(data.url)
    } catch (error) {
      console.error("[v0] Image upload error:", error)
      alert("Image upload failed, please try again")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !instructor || lessons.length === 0) {
      alert("Please fill in all required fields and add at least one lesson")
      return
    }

    const newCourse = {
      id: `course-${Date.now()}`,
      title,
      description,
      instructor,
      duration,
      level,
      image: image || "/placeholder.svg?height=400&width=600",
      enrolled: 0,
      rating: 0,
      students: 0,
      lessons: lessons.map((lesson, index) => ({
        ...lesson,
        id: `${Date.now()}-lesson-${index}`,
        completed: false,
      })),
    }

    addCourse(newCourse)
    router.push("/dashboard/courses")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Skincare Basics for Beginners"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the course content and learning objectives"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instructor">Instructor Name *</Label>
                  <Input
                    id="instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="e.g., Dr. Sarah Chen"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Course Duration</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 2h 30min"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="level">Difficulty Level</Label>
                <Select value={level} onValueChange={(value: any) => setLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">Course Cover Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                    disabled={uploading}
                  />
                  {image && (
                    <img src={image || "/placeholder.svg"} alt="Preview" className="h-20 w-20 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Course Content</Label>
                <Button type="button" onClick={addLesson} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>

              {lessons.map((lesson, index) => (
                <Card key={lesson.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Lesson {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeLesson(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Lesson Title</Label>
                        <Input
                          value={lesson.title}
                          onChange={(e) => updateLesson(index, "title", e.target.value)}
                          placeholder="e.g., Understanding Skin Types"
                        />
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <Input
                          value={lesson.duration}
                          onChange={(e) => updateLesson(index, "duration", e.target.value)}
                          placeholder="e.g., 15 min"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Article Content</Label>
                      <Textarea
                        value={lesson.content || ""}
                        onChange={(e) => updateLesson(index, "content", e.target.value)}
                        placeholder="Enter article content..."
                        rows={6}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              {lessons.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No lessons added yet. Click the button above to add one.</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={uploading} className="flex-1">
                {uploading ? "Uploading..." : "Create Course"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/courses")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
