import TodoList from "@/components/todo-list"
import TodoDetail from "@/components/todo-detail"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Todo App</h1>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <TodoList />
        </div>
        <div className="w-full md:w-1/2">
          <TodoDetail />
        </div>
      </div>
    </main>
  )
}
