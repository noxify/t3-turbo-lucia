import { Loader2Icon } from "lucide-react"

export function Spinner() {
  return (
    <div className="container relative  grid h-screen flex-col items-center justify-center ">
      <div className="mx-auto flex  w-[350px] flex-col justify-center space-y-6 ">
        <div className="flex items-center space-x-4">
          <Loader2Icon className="animate-spin" />
          Loading...
        </div>
      </div>
    </div>
  )
}
