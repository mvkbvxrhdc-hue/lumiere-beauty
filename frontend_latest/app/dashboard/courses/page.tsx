import { courses } from "@/lib/courses-data"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, Star, Users, BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CoursesPage() {
  const displayCourses = courses

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Courses</h1>
          <p className="text-muted-foreground mt-1">Master skincare techniques with expert-led video courses</p>
        </div>
      </div>

      {displayCourses && displayCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course) => (
            <Card key={course.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <Badge className="absolute top-3 right-3 bg-black/60 hover:bg-black/70 backdrop-blur-sm border-0">
                  {course.level}
                </Badge>
              </div>
              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    {course.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-medium">{course.rating}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{course.description}</p>
              </CardHeader>
              <CardContent className="p-5 pt-2 pb-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course.students.toLocaleString()} students
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {course.instructor.charAt(0)}
                  </div>
                  <span className="text-xs font-medium">{course.instructor}</span>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex items-center justify-between border-t bg-muted/20 mt-auto">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">${course.price === 0 ? "Free" : course.price}</span>
                </div>
                <Link href={`/dashboard/courses/${course.id}`}>
                  <Button size="sm" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    View Course
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No courses available</h3>
          <p className="text-muted-foreground">Check back later for new content.</p>
        </div>
      )}
    </div>
  )
}
