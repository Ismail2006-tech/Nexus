import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { careerGoal, currentSkills } = await req.json();

    if (!careerGoal) {
      return NextResponse.json({ error: "Missing career goal" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const prompt = `
      You are an expert technical career advisor. A student wants to become a "${careerGoal}".
      ${currentSkills ? `They already have the following skills: ${currentSkills}.` : 'They are starting fresh.'}
      
      Generate a personalized, step-by-step learning roadmap tailored to this exact career domain (${careerGoal}). 
      DO NOT output a generic programming roadmap. 
      CRITICAL: Keep all text ultra-concise (1 short sentence max per field). Limit to EXACTLY 5 STAGES total to ensure blazing-fast generation!
      
      Include stages for: Foundations, Core Skills, Projects/Portfolio, and Interview Prep.
      
      Return ONLY a raw JSON object with the following structure:
      {
        "careerOverview": {
          "title": "Exact Role Name",
          "description": "1 short sentence explaining this role.",
          "estimatedTime": "e.g. 6-12 Months",
          "keySkills": ["Skill1", "Skill2", "Skill3"]
        },
        "stages": [
          {
            "id": "stage-1",
            "name": "Stage 1 - [Name]",
            "whyLearn": "1 short sentence why this is important.",
            "topics": ["Topic 1", "Topic 2", "Topic 3"],
            "recommendedTools": ["Tool 1", "Tool 2"],
            "skillsGained": ["Skill 1", "Skill 2"],
            "projects": [
              { "name": "Relevant Project Name", "level": "Beginner" }
            ]
          }
          // MUST BE EXACTLY 5 STAGES MAX
        ]
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error(`Failed to generate content: ${data?.error?.message || response.statusText}`);
    }

    let textResponse = data.candidates[0].content.parts[0].text;
    
    // Clean potential markdown backticks if Gemini ignores the mime_type
    const match = textResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      textResponse = match[1];
    }
    
    const result = JSON.parse(textResponse);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
