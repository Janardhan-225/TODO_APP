"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Todo {
  _id: string
  title: string
  description: string
  createdAt: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page") || "1")
  const selectedId = searchParams.get("id")

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/todos?page=${page}&limit=5`)
      const data = await response.json()
      setTodos(data.todos)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching todos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [page])

  const createNewTodo = async () => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Todo",
          description: "Add description here",
        }),
      })

      if (response.ok) {
        const newTodo = await response.json()
        fetchTodos()
        router.push(`/?id=${newTodo._id}`)
      }
    } catch (error) {
      console.error("Error creating todo:", error)
    }
  }

  const selectTodo = (id: string) => {
    router.push(`/?id=${id}${page > 1 ? `&page=${page}` : ""}`)
  }

  const handlePagination = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    if (selectedId) params.set("id", selectedId)
    router.push(`/?${params.toString()}`)
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Todos</CardTitle>
        <Button onClick={createNewTodo} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Todo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
          ) : todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo._id}
                onClick={() => selectTodo(todo._id)}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedId === todo._id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <h3 className="font-medium truncate">{todo.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{formatDate(new Date(todo.createdAt))}</p>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-muted-foreground">No todos found. Create your first todo!</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" size="sm" onClick={() => handlePagination(page - 1)} disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePagination(page + 1)}
              disabled={page >= totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
