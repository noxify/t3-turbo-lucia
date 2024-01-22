import { CommandIcon } from "lucide-react"

import { cn } from "@acme/ui/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center text-lg font-medium",
        className,
      )}
    >
      <CommandIcon className="mr-1" />
      Acme Inc
    </div>
  )
}
