"use client"

import { use } from "react"

import type { RouterOutputs } from "@acme/api"
import { auth, lucia } from "@acme/auth"
import { Button } from "@acme/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { Label } from "@acme/ui/label"
import { toast } from "@acme/ui/toast"
import { UpdateProfileSchema } from "@acme/validators"

import { api } from "@/trpc/react"

export function UpdateProfileForm(props: {
  user: RouterOutputs["user"]["profile"]
}) {
  const utils = api.useUtils()
  const form = useForm({
    schema: UpdateProfileSchema,
    defaultValues: {
      name: props?.user?.name ?? "",
    },
  })

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate()
      toast.success("Profile updated.")
    },

    onError: (err) => {
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
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Username" />
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
