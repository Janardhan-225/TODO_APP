"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Todo {
  _id: string
  title: string
  description: string
  createdAt: string
}

export default function TodoDetail() {
  const [todo, setTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchTodo(id)
    } else {
      setTodo(null)
      setTitle("")
      setDescription("")
    }
  }, [id])

  const fetchTodo = async (todoId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/todos/${todoId}`)
      if (response.ok) {
        const data = await response.json()
        setTodo(data)
        setTitle(data.title)
        setDescription(data.description)
      }
    } catch (error) {
      console.error("Error fetching todo:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateTodo = async () => {
    if (!id) return

    setSaving(true)
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      })

      if (response.ok) {
        toast({
          title: "Todo updated",
          description: "Your todo has been updated successfully.",
        })
        const updatedTodo = await response.json()
        setTodo(updatedTodo)
      }
    } catch (error) {
      console.error("Error updating todo:", error)
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!id) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Todo Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Select a todo to view details</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Todo Details</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-24" />
          </div>
        ) : todo ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Todo title" />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Todo description"
                rows={5}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Created: {todo.createdAt ? formatDate(new Date(todo.createdAt)) : "Just now"}
            </div>
            <Button
              onClick={updateTodo}
              disabled={saving || (title === todo.title && description === todo.description)}
              className="mt-4"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Todo not found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
