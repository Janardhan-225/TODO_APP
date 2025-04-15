import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Todo } from "@/models/todo"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "5")
    const skip = (page - 1) * limit

    await connectToDatabase()

    const todos = await Todo.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    const totalTodos = await Todo.countDocuments({})
    const totalPages = Math.ceil(totalTodos / limit)

    return NextResponse.json({
      todos,
      totalPages,
      currentPage: page,
      totalTodos,
    })
  } catch (error) {
    console.error("Error fetching todos:", error)
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    await connectToDatabase()

    const newTodo = new Todo({
      title,
      description: description || "",
      createdAt: new Date(),
    })

    await newTodo.save()

    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    console.error("Error creating todo:", error)
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
  }
}
