"use client"

import { Loader } from "lucide-react"


function LoadingPage() {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <Loader className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  )
}

export default LoadingPage
