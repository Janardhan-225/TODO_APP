import mongoose from "mongoose"

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for this todo."],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema)
