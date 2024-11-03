"use client"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

function ErrorPage() {
  return (
    <div className="h-screen flex items-center gap-y-2 justify-center flex-col">
      <AlertTriangle className="text-red-500 size-6 mx-auto text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Something went wrong!</p>
      <Button variant="secondary" asChild className="size-sm">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}

export default ErrorPage
