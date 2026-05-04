import { courses } from "@/lib/courses-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, FileText, Share2, Heart, Star, BookOpen, PlayCircle, HelpCircle } from "lucide-react"
import { EnrollButton } from "./enroll-button"

export const dynamic = "force-dynamic"

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const course = courses.find((c) => c.id === id)

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link href="/dashboard/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    )
  }

  const lessons = course.lessons || []

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero Section */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {course.category}
                </Badge>
                <Badge variant="outline">{course.level}</Badge>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {course.rating} ({course.students.toLocaleString()} students)
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
              <p className="text-lg text-muted-foreground">{course.description}</p>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created by</p>
                    <p className="text-sm text-primary font-semibold">{course.instructor}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>Last updated {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg border-primary/10 overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">${course.price === 0 ? "Free" : course.price}</span>
                  </div>

                  <EnrollButton courseId={course.id} price={course.price} />

                  <p className="text-xs text-center text-muted-foreground">30-Day Money-Back Guarantee</p>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium text-sm">This course includes:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-red-500" />
                        {lessons.filter(l => l.type === "video").length} YouTube video tutorials
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        {course.duration} of learning content
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Access on mobile and tablet
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Certificate of completion
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                      <Share2 className="w-4 h-4" /> Share
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                      <Heart className="w-4 h-4" /> Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="curriculum" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                <TabsTrigger
                  value="curriculum"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="pt-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Course Content</h3>
                  <p className="text-sm text-muted-foreground">
                    {lessons.length} lessons • {course.duration} total length
                  </p>
                </div>

                <div className="border rounded-lg divide-y">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          {lesson.type === "video" ? (
                            <PlayCircle className="w-4 h-4 text-red-500" />
                          ) : lesson.type === "quiz" ? (
                            <HelpCircle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="font-medium">{lesson.title}</span>
                          {lesson.type === "video" && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                              YouTube
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="overview" className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h3>About this course</h3>
                  <p>{course.description}</p>
                  <p>
                    This comprehensive course is designed for {course.level.toLowerCase()} level students who want to
                    master {course.category.toLowerCase()}. Led by {course.instructor}, you'll gain practical skills and
                    theoretical knowledge to improve your skincare routine.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6">
                <div className="flex items-center gap-4 mb-8 p-6 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{course.rating}</div>
                    <div className="flex gap-0.5 justify-center my-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(course.rating) ? "fill-current" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">Course Rating</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2 text-xs">
                          <div className="w-12 text-right">{stars} stars</div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500"
                              style={{ width: stars === 5 ? "70%" : stars === 4 ? "20%" : "5%" }}
                            />
                          </div>
                          <div className="w-8 text-right">{stars === 5 ? "70%" : stars === 4 ? "20%" : "5%"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
