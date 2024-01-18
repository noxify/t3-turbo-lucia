"use client"

import { revalidatePath } from "next/cache"

import type { LuciaUser } from "@acme/auth"
import { Button } from "@acme/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { toast } from "@acme/ui/toast"
import { UpdateProfileSchema } from "@acme/validators"

import { api } from "@/trpc/react"

export function UpdateProfileForm({ user }: { user: LuciaUser }) {
  const utils = api.useUtils()
  const form = useForm({
    schema: UpdateProfileSchema,
    defaultValues: {
      name: user.name ?? "",
    },
  })

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      form.reset()
      await utils.user.invalidate()
      toast.success("Profile updated.")
    },
    onError: (err) => {
      console.log(err)
      toast.error(
        err?.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to update your profile"
          : "Failed to update your profile",
      )
    },
  })

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit(async (data) => {
          updateProfile.mutate(data)
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button>Update</Button>
      </form>
    </Form>
  )
}
