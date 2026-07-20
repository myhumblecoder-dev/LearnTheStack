"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { rescheduleOverdueTopics } from "@/actions/reschedule"
import { Button } from "@/components/ui/Button"

export function CatchUpButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await rescheduleOverdueTopics()
      router.refresh()
    })
  }

  return (
    <Button size="sm" onClick={handleClick} disabled={pending}>
      {pending ? "Rescheduling..." : "Catch me up"}
    </Button>
  )
}