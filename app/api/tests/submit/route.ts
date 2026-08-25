import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { category, score, total, timeTaken } = await req.json();

    const percentage = (score / total) * 100;

    const testResult = await db.testResult.create({
      data: {
        userId: session.user.id,
        category,
        score,
        total,
        percentage,
        timeTaken,
      },
    });

    // Update readiness score
    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });
    
    // Slight increase in readiness score based on test performance
    if (profile && percentage > 70) {
      const newReadiness = Math.min(profile.placementReadiness + 2, 100);
      await db.profile.update({
        where: { userId: session.user.id },
        data: { placementReadiness: newReadiness },
      });
    }

    return NextResponse.json({ resultId: testResult.id });
  } catch (error) {
    console.error("Test submission error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
