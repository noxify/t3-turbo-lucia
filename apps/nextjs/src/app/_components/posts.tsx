"use client"

import { use } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { RouterOutputs } from "@acme/api"
import { CreatePostSchema } from "@acme/db/schema"
import { useI18n } from "@acme/locales/client"
import { cn } from "@acme/ui"
import { Button } from "@acme/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { useToast } from "@acme/ui/use-toast"

import { api } from "~/trpc/react"

export function CreatePostForm() {
  const t = useI18n()

  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      content: "",
      title: "",
    },
  })

  const utils = api.useUtils()
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      form.reset()
      await utils.post.invalidate()
    },
    onError: (err) => {
      toast({
        description:
          err.data?.code === "UNAUTHORIZED"
            ? t("error.not_authorized")
            : t("posts.create.failed"),
        variant: "destructive",
      })
    },
  })

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {
          createPost.mutate(data)
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder={t("posts.form.title")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder={t("posts.form.content")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button>{t("common.create")}</Button>
      </form>
    </Form>
  )
}

export function PostList(props: {
  posts: Promise<RouterOutputs["post"]["all"]>
}) {
  const t = useI18n()

  // TODO: Make `useSuspenseQuery` work without having to pass a promise from RSC
  const initialData = use(props.posts)
  const { data: posts } = api.post.all.useQuery(undefined, {
    initialData,
  })

  if (posts.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">
            {t("posts.no_records")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {posts.map((p) => {
        return <PostCard key={p.id} post={p} />
      })}
    </div>
  )
}

export function PostCard(props: {
  post: RouterOutputs["post"]["all"][number]
}) {
  const t = useI18n()
  const { toast } = useToast()
  const utils = api.useUtils()
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate()
    },
    onError: (err) => {
      toast({
        description:
          err.data?.code === "UNAUTHORIZED"
            ? t("error.not_authorized")
            : t("posts.delete.failed"),
        variant: "destructive",
      })
    },
  })

  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-primary">{props.post.title}</h2>
        <p className="mt-2 text-sm">{props.post.content}</p>
      </div>
      <div>
        <Button
          variant="ghost"
          className="cursor-pointer text-sm font-bold uppercase text-primary hover:bg-transparent hover:text-white"
          onClick={() => deletePost.mutate(props.post.id)}
        >
          {t("common.delete")}
        </Button>
      </div>
    </div>
  )
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props
  return (
    <div className="flex flex-row rounded-lg bg-muted p-4">
      <div className="flex-grow">
        <h2
          className={cn(
            "w-1/4 rounded bg-primary text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  )
}
