import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roadmap = await db.careerRoadmap.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });

    if (!roadmap) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      id: roadmap.id,
      careerGoal: roadmap.careerGoal,
      progress: roadmap.progress,
      data: JSON.parse(roadmap.roadmapData)
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { careerGoal, roadmapData } = await req.json();

    const newRoadmap = await db.careerRoadmap.create({
      data: {
        userId: session.user.id,
        careerGoal,
        roadmapData: JSON.stringify(roadmapData),
        progress: 0.0
      }
    });

    return NextResponse.json(newRoadmap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save roadmap" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, roadmapData, progress } = await req.json();

    const updated = await db.careerRoadmap.update({
      where: { id, userId: session.user.id },
      data: {
        roadmapData: JSON.stringify(roadmapData),
        progress
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update roadmap" }, { status: 500 });
  }
}
