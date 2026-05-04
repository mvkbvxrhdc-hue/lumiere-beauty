import { courses } from "@/lib/courses-data"
import { CourseLearnClient } from "./course-learn-client"

export default async function CourseLearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = courses.find((c) => c.id === id)

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Course Not Found</h1>
      </div>
    )
  }

  return <CourseLearnClient course={course} />
}
