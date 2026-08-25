import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { topicId, topicName, stage, completed } = await req.json();

    if (!topicId) {
      return NextResponse.json({ message: "Topic ID is required" }, { status: 400 });
    }

    const progress = await db.topicProgress.upsert({
      where: {
        userId_topicId: {
          userId: session.user.id,
          topicId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        topicId,
        topicName,
        stage,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Update overall placement readiness score
    const allProgress = await db.topicProgress.findMany({
      where: { userId: session.user.id },
    });
    
    // Simple readiness calculation: Total topics = 42 (assuming for now)
    const completedCount = allProgress.filter(p => p.completed).length;
    const readinessScore = Math.min(Math.round((completedCount / 42) * 100), 100);

    await db.profile.update({
      where: { userId: session.user.id },
      data: { placementReadiness: readinessScore },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Roadmap progress error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
