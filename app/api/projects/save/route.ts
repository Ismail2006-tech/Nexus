import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { project } = await req.json();
    
    if (!project || !project.name) {
      return NextResponse.json({ error: "Project data is required" }, { status: 400 });
    }

    const savedProject = await db.savedProject.create({
      data: {
        userId: session.user.id,
        projectName: project.name,
        domain: project.domain || "General", // Will pass this from the client
        level: project.level,
        description: project.shortDescription,
        technologies: JSON.stringify(project.technologies),
        difficulty: project.difficulty,
        placementValue: project.placementValue,
        status: "Interested"
      }
    });

    return NextResponse.json(savedProject);

  } catch (error) {
    console.error("Save project error:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedProjects = await db.savedProject.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(savedProjects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch saved projects" }, { status: 500 });
  }
}
