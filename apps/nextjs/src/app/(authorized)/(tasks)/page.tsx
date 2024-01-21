import { Suspense } from "react"
import { redirect } from "next/navigation"

import { auth } from "@acme/auth"

import { CreatePostForm, PostCardSkeleton, PostList } from "@/components/posts"
import { api } from "@/trpc/server"

export default async function HomePage() {
  //await new Promise((resolve) => setTimeout(resolve, 5000))

  const session = await auth()

  if (!session.user) {
    redirect("/auth")
  }

  const posts = api.post.all()

  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-primary">T3</span> Turbo
        </h1>

        <CreatePostForm />
        <div className="w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            }
          >
            <PostList posts={posts} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
