"use client"

import { useState } from "react"
import type { Course } from "@/lib/courses-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { VideoPlayer } from "@/components/video-player"
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  CheckCircle,
  ArrowLeft,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CourseLearnClientProps {
  course: Course
}

export function CourseLearnClient({ course }: CourseLearnClientProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  const lessons = course.lessons || []
  const currentLesson = lessons[currentLessonIndex]

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons([...completedLessons, currentLesson.id])
      }
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  const handleLessonClick = (index: number) => {
    setCurrentLessonIndex(index)
  }

  const markAsComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id])
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-4 h-4 text-red-500" />
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-amber-500" />
      default:
        return <FileText className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/courses/${course.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回课程
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="font-semibold truncate max-w-md">{course.title}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>进度：{completedLessons.length}/{lessons.length}</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Lesson List */}
        <div className="w-80 border-r bg-card min-h-[calc(100vh-65px)] overflow-y-auto hidden lg:block">
          <div className="p-4 border-b">
            <h2 className="font-semibold">课程内容</h2>
            <p className="text-sm text-muted-foreground">
              {lessons.length} 节课 · {course.duration}
            </p>
          </div>
          <div className="divide-y">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => handleLessonClick(index)}
                className={cn(
                  "w-full p-4 text-left flex items-start gap-3 hover:bg-muted/50 transition-colors",
                  currentLessonIndex === index && "bg-primary/5 border-l-2 border-primary"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {completedLessons.includes(lesson.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs",
                      currentLessonIndex === index ? "border-primary text-primary" : "border-muted-foreground"
                    )}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getLessonIcon(lesson.type)}
                    <span className={cn(
                      "font-medium text-sm truncate",
                      currentLessonIndex === index && "text-primary"
                    )}>
                      {lesson.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{lesson.duration}</span>
                    {lesson.type === "video" && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                        YouTube
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-[calc(100vh-65px)]">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Lesson Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {getLessonIcon(currentLesson.type)}
                <Badge variant="outline">
                  第 {currentLessonIndex + 1} 课 / 共 {lessons.length} 课
                </Badge>
                {currentLesson.type === "video" && (
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                    YouTube 视频
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
              <p className="text-muted-foreground mt-1">{currentLesson.duration}</p>
            </div>

            {/* Video Player or Content */}
            {currentLesson.type === "video" && currentLesson.videoUrl ? (
              <div className="mb-6">
                <VideoPlayer url={currentLesson.videoUrl} title={currentLesson.title} />
              </div>
            ) : currentLesson.type === "quiz" ? (
              <Card className="mb-6">
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">知识测验</h3>
                  <p className="text-muted-foreground mb-4">{currentLesson.content}</p>
                  <Button>开始测验</Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardContent className="p-8">
                  <BookOpen className="w-12 h-12 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-4">阅读材料</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{currentLesson.content}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">课程说明</h3>
                <p className="text-muted-foreground">{currentLesson.content}</p>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentLessonIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                上一课
              </Button>
              
              <div className="flex gap-2">
                {!completedLessons.includes(currentLesson.id) && (
                  <Button variant="outline" onClick={markAsComplete}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    标记完成
                  </Button>
                )}
              </div>

              <Button 
                onClick={handleNext}
                disabled={currentLessonIndex === lessons.length - 1}
              >
                下一课
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
