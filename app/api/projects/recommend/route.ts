import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain } = await req.json();
    
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const prompt = `
      You are an expert technical career advisor for college students.
      A student wants to build projects in the following domain: "${domain}".
      
      CRITICAL REQUIREMENT: ALL 6 projects MUST be strictly and highly specific to the "${domain}" domain. 
      For example, if the domain is Data Science, DO NOT recommend web development projects (like a ToDo app). 
      If the domain is Cybersecurity, recommend security tools, not generic software. Every project must clearly belong to ${domain}.
      
      Generate exactly 6 project recommendations: 2 Beginner, 2 Intermediate, and 2 Advanced.
      CRITICAL: Keep all descriptions ultra-concise (1 sentence maximum) to minimize generation time!
      
      Return ONLY a raw JSON object (no markdown formatting, no backticks) with the following structure:
      {
        "projects": [
          {
            "name": "Project Name",
            "level": "Beginner | Intermediate | Advanced",
            "shortDescription": "1 short sentence explaining what it does.",
            "technologies": ["Tech1", "Tech2"],
            "skills": ["Skill1", "Skill2"],
            "difficulty": "Easy | Medium | Hard",
            "estimatedTime": "e.g. 1-2 weeks",
            "placementValue": "Good | Very Good | Excellent",
            "overview": "1-2 short sentences detailed overview.",
            "problem": "Real-world problem it solves (1 sentence)",
            "solution": "How it solves it (1 sentence)",
            "mainFeatures": ["Feature1", "Feature2"],
            "skillsRequired": ["Prerequisite 1"],
            "skillsToLearn": ["What they will gain"],
            "developmentSteps": ["Step 1", "Step 2", "Step 3"],
            "futureUpgrades": ["Idea 1", "Idea 2"],
            "placementReason": "Why this is useful (1 short sentence)",
            "placementSkills": ["Problem Solving"],
            "interviewTopics": ["Why did you choose this tech?"]
          }
        ]
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error("Failed to generate content");
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    const result = JSON.parse(textResponse);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
