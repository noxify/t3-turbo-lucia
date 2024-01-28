"use server"

import type { z } from "zod"
import { revalidatePath } from "next/cache"

import { db, eq, schema } from "@acme/db"

export async function updateTaskLabel({
  id,
  label,
}: Required<z.infer<typeof schema.updateTaskLabelSchema>>) {
  await db.update(schema.task).set({ label }).where(eq(schema.task.id, id))

  revalidatePath("/tasks")
}

export async function updateTaskStatus({
  id,
  status,
}: Required<z.infer<typeof schema.updateTaskStatusSchema>>) {
  console.log("updateTaskStatusAction", id, status)

  await db.update(schema.task).set({ status }).where(eq(schema.task.id, id))

  revalidatePath("/tasks")
}

export async function updateTaskPriority({
  id,
  priority,
}: Required<z.infer<typeof schema.updateTaskPrioritySchema>>) {
  console.log("updatePriorityAction", id, priority)

  await db.update(schema.task).set({ priority }).where(eq(schema.task.id, id))

  revalidatePath("/tasks")
}

export async function deleteTask(input: { id: string }) {
  await db.delete(schema.task).where(eq(schema.task.id, input.id))
  revalidatePath("/tasks")
}
