"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckCircle, Loader2, PlayCircle } from "lucide-react"

interface EnrollButtonProps {
  courseId: string
  price: number
}

export function EnrollButton({ courseId, price }: EnrollButtonProps) {
  const router = useRouter()
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  const handleEnroll = async () => {
    setIsEnrolling(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsEnrolling(false)
    setIsEnrolled(true)

    toast.success("Enrollment successful!", {
      description: "Redirecting to course learning page...",
    })

    // Navigate to learn page after short delay
    setTimeout(() => {
      router.push(`/dashboard/courses/${courseId}/learn`)
    }, 1000)
  }

  const handleStartLearning = () => {
    router.push(`/dashboard/courses/${courseId}/learn`)
  }

  if (isEnrolled) {
    return (
      <Button 
        className="w-full size-lg text-lg font-semibold shadow-md bg-green-600 hover:bg-green-700" 
        onClick={handleStartLearning}
      >
        <PlayCircle className="mr-2 h-5 w-5" />
        Start Learning
      </Button>
    )
  }

  return (
    <Button className="w-full size-lg text-lg font-semibold shadow-md" onClick={handleEnroll} disabled={isEnrolling}>
      {isEnrolling ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Enrolling...
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  )
}
