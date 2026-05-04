import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { courses } from "@/lib/courses-data"
import { products } from "@/lib/products-data"

export async function GET() {
  try {
    // 1. Seed Courses
    console.log("Seeding courses...")

    // Check if courses exist
    const { count: coursesCount } = await supabaseAdmin.from("courses").select("*", { count: "exact", head: true })

    if (coursesCount === 0) {
      for (const course of courses) {
        // Insert course
        const { data: courseData, error: courseError } = await supabaseAdmin
          .from("courses")
          .insert({
            title: course.title,
            description: course.description,
            instructor_name: course.instructor,
            instructor_title: course.instructorTitle,
            instructor_avatar: course.instructorAvatar,
            duration: course.duration,
            level: course.level,
            category: course.category,
            image_url: course.image,
            rating: course.rating,
            student_count: course.students,
            price: course.price,
            what_you_learn: course.whatYouLearn,
            requirements: course.requirements,
            // We'll skip recommended_products for now as IDs won't match yet
          })
          .select()
          .single()

        if (courseError) {
          console.error(`Error inserting course ${course.title}:`, courseError)
          continue
        }

        // Insert lessons for this course
        if (course.lessons && course.lessons.length > 0) {
          const lessonsToInsert = course.lessons.map((lesson, index) => ({
            course_id: courseData.id,
            title: lesson.title,
            duration: lesson.duration,
            type: lesson.type,
            content: lesson.content,
            video_url: lesson.videoUrl,
            order_index: index,
          }))

          const { error: lessonsError } = await supabaseAdmin.from("lessons").insert(lessonsToInsert)

          if (lessonsError) {
            console.error(`Error inserting lessons for course ${course.title}:`, lessonsError)
          }
        }
      }
      console.log("Courses seeded successfully")
    } else {
      console.log("Courses already exist, skipping...")
    }

    // 2. Seed Products
    console.log("Seeding products...")

    // Check if products exist
    const { count: productsCount } = await supabaseAdmin.from("products").select("*", { count: "exact", head: true })

    if (productsCount === 0) {
      for (const product of products) {
        // Insert product
        const { data: productData, error: productError } = await supabaseAdmin
          .from("products")
          .insert({
            name: product.name,
            brand: product.brand,
            description: product.description,
            detailed_description: product.detailedDescription || product.description,
            price: product.price,
            original_price: product.originalPrice,
            category: product.category,
            skin_types: product.skinType,
            rating: product.rating,
            review_count: product.reviews,
            image_url: product.image,
            images: product.images || [product.image],
            badge: product.badge,
            tags: product.tags,
            in_stock: product.inStock,
            stock_quantity: product.stockQuantity,
            seller: product.seller,
            shipping_info: product.shippingInfo,
            highlights: product.highlights,
            specifications: product.specifications,
          })
          .select()
          .single()

        if (productError) {
          console.error(`Error inserting product ${product.name}:`, productError)
          continue
        }

        // Insert reviews if any
        if (product.customerReviews && product.customerReviews.length > 0) {
          // We need a user ID for reviews. We'll try to find one or create a dummy one?
          // For simplicity, we'll skip reviews seeding or need a valid user ID.
          // Let's skip reviews for now to avoid foreign key constraint errors if users don't exist.
        }
      }
      console.log("Products seeded successfully")
    } else {
      console.log("Products already exist, skipping...")
    }

    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
