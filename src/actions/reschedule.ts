"use server"

import { prisma } from "@/lib/db"
import { computeReschedule } from "@/lib/curriculum/reschedule"
import { todayUtc } from "@/lib/curriculum/schedule"

export async function rescheduleOverdueTopics() {
  const topics = await prisma.topic.findMany({
    include: {
      progress: true,
    },
  })

  const plan = computeReschedule(topics, todayUtc())

  for (const { topicId, newScheduledDate } of plan) {
    await prisma.topic.update({
      where: { id: topicId },
      data: { scheduledDate: newScheduledDate },
    })
  }

  return { rescheduled: plan.length }
}