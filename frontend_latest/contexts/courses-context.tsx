"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { courses as staticCourses, type Course } from "@/lib/courses-data"

interface CourseProgress {
  courseId: string
  completedLessons: string[]
  lastAccessedLesson: string
  progress: number
  enrolledAt: string
  completedAt?: string
}

interface CoursesContextType {
  allCourses: Course[]
  enrolledCourses: CourseProgress[]
  enrollInCourse: (courseId: string) => void
  isEnrolled: (courseId: string) => boolean
  getCourseProgress: (courseId: string) => CourseProgress | undefined
  markLessonComplete: (courseId: string, lessonId: string) => void
  isLessonComplete: (courseId: string, lessonId: string) => boolean
  updateLastAccessedLesson: (courseId: string, lessonId: string) => void
  addCourse: (course: Course) => void
  updateCourse: (courseId: string, course: Course) => void
  deleteCourse: (courseId: string) => void
  isCustomCourse: (courseId: string) => boolean
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined)

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const [customCourses, setCustomCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const allCourses = [...staticCourses, ...customCourses]

  // Load enrolled courses and custom courses from localStorage
  useEffect(() => {
    try {
      const storedEnrolled = localStorage.getItem("enrolledCourses")
      if (storedEnrolled) {
        setEnrolledCourses(JSON.parse(storedEnrolled))
      }

      const storedCustom = localStorage.getItem("customCourses")
      if (storedCustom) {
        setCustomCourses(JSON.parse(storedCustom))
      }
    } catch (error) {
      console.error("Error loading courses:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save enrolled courses and custom courses to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses))
        localStorage.setItem("customCourses", JSON.stringify(customCourses))
      } catch (error) {
        console.error("Error saving courses:", error)
      }
    }
  }, [enrolledCourses, customCourses, isLoaded])

  const enrollInCourse = (courseId: string) => {
    if (!isEnrolled(courseId)) {
      const newProgress: CourseProgress = {
        courseId,
        completedLessons: [],
        lastAccessedLesson: "",
        progress: 0,
        enrolledAt: new Date().toISOString(),
      }
      setEnrolledCourses((prev) => [...prev, newProgress])
    }
  }

  const isEnrolled = (courseId: string) => {
    return enrolledCourses.some((course) => course.courseId === courseId)
  }

  const getCourseProgress = (courseId: string) => {
    return enrolledCourses.find((course) => course.courseId === courseId)
  }

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setEnrolledCourses((prev) => {
      return prev.map((course) => {
        if (course.courseId === courseId) {
          const completedLessons = course.completedLessons.includes(lessonId)
            ? course.completedLessons
            : [...course.completedLessons, lessonId]

          const totalLessons = allCourses.find((c) => c.id === courseId)?.lessons.length || 1
          const progress = (completedLessons.length / totalLessons) * 100

          const completedAt = progress === 100 ? new Date().toISOString() : undefined

          return {
            ...course,
            completedLessons,
            progress,
            completedAt,
          }
        }
        return course
      })
    })
  }

  const isLessonComplete = (courseId: string, lessonId: string) => {
    const progress = getCourseProgress(courseId)
    return progress?.completedLessons.includes(lessonId) || false
  }

  const updateLastAccessedLesson = (courseId: string, lessonId: string) => {
    setEnrolledCourses((prev) => {
      return prev.map((course) => {
        if (course.courseId === courseId) {
          return {
            ...course,
            lastAccessedLesson: lessonId,
          }
        }
        return course
      })
    })
  }

  const addCourse = (course: Course) => {
    setCustomCourses((prev) => [...prev, course])
  }

  const updateCourse = (courseId: string, updatedCourse: Course) => {
    setCustomCourses((prev) => prev.map((course) => (course.id === courseId ? updatedCourse : course)))
  }

  const deleteCourse = (courseId: string) => {
    setCustomCourses((prev) => prev.filter((course) => course.id !== courseId))
    // Also remove enrollment data for this course
    setEnrolledCourses((prev) => prev.filter((course) => course.courseId !== courseId))
  }

  const isCustomCourse = (courseId: string) => {
    return customCourses.some((course) => course.id === courseId)
  }

  return (
    <CoursesContext.Provider
      value={{
        allCourses,
        enrolledCourses,
        enrollInCourse,
        isEnrolled,
        getCourseProgress,
        markLessonComplete,
        isLessonComplete,
        updateLastAccessedLesson,
        addCourse,
        updateCourse,
        deleteCourse,
        isCustomCourse,
      }}
    >
      {children}
    </CoursesContext.Provider>
  )
}

export function useCourses() {
  const context = useContext(CoursesContext)
  if (context === undefined) {
    throw new Error("useCourses must be used within a CoursesProvider")
  }
  return context
}
