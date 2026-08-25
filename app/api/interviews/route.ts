import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, overallScore, communication, technical, confidence, feedbackReport, weakAreas, strongAreas } = await req.json();

    const result = await db.interviewResult.create({
      data: {
        userId: session.user.id,
        type,
        overallScore,
        communication,
        technical,
        confidence,
        feedbackReport,
        weakAreas,
        strongAreas,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interview submission error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
