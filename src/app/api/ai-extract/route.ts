import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { extractedData, selectedTemplate } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const config = {
      responseMimeType: "text/plain",
    };

    const model = "gemini-1.5-flash";
    const prompt = `
You are a professional AI data extractor and slide builder. Your task is to transform structured content into a full presentation using a dynamic, predefined slide template.

---

### 📥 INPUTS:
1. **selectedFile** – Raw user-uploaded content (documentation, articles, specs, notes, code, etc.).
2. **selectedTemplate** – A structured slide template that includes:
   - **type** and **description**: Defines the purpose and tone.
   - **slides**: Each with:
     - **title**: Slide name.
     - **description**: Explains what to include.
     - **categorizedOutput**: STRICTLY defines the required output format (e.g., string, string[], object[], etc.).

---

### 🧠 YOUR ROLE: Professional Presentation Analyst

For each slide, follow these principles:

- **UNDERSTAND the intent** behind each slide using its title + description.
- **EXTRACT**, **ADAPT**, or **SYNTHESIZE** relevant content from the uploaded file.
- **STRICTLY match the output format** ("categorizedOutput). No deviation is allowed.
- If exact content is missing, **use intelligent inference** based on context — but NEVER leave any slide blank.
- Avoid generic placeholders like “N/A”, “not found”, “example”, etc.
- Output must feel polished, complete, and context-aware.

---

### 🎯 OUTPUT FORMAT

Return a full object in this structure:

\`\`\`json
{
  "type": "Instructional", // or Informative, Convincing, etc.
  "description": "Ideal for teaching practical skills or walkthroughs.",
  "slides": [
    {
      "title": "Title & Objective",
      "description": "State the learning goal clearly.",
      "categorizedOutput": {
        "title": "How to Build a Responsive Web Page",
        "content": "Learn to use Flexbox and CSS Grid to create adaptive layouts."
      }
    },
    {
      "title": "Checklist",
      "description": "Tasks or items to complete.",
      "categorizedOutput": [
        "Install a code editor (e.g., VS Code)",
        "Set up a basic HTML/CSS structure",
        "Use Flexbox for layout",
        "Add media queries for responsiveness"
      ]
    }
  ]
}
\`\`\`

---

### 🔍 CONTEXT

**Extracted File Content**:
${JSON.stringify(extractedData)}

---

**Selected Presentation Template**:
${JSON.stringify(selectedTemplate)}

---

### 🚨 REMINDERS:
- Output must cover **ALL slides** in the template.
- Use accurate formatting for "categorizedOutput" as required per slide.
- Be **clear**, **professional**, and **slide-purpose aware**.
- **You are not summarizing** — you are transforming content into structured slides.

---
`;

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = "";

    for await (const chunk of response) {
      const part = chunk.candidates?.[0]?.content?.parts?.[0];
      if (typeof part === "string") {
        fullResponse += part;
      } else if (part?.text) {
        fullResponse += part.text;
      }
    }

    fullResponse = fullResponse.replace(/```json|```/g, "").trim();

    // console.log("🟢 full response");
    // console.log(fullResponse);
    // Now parse the complete string
    const parsedSlides = JSON.parse(fullResponse);

    return NextResponse.json({ result: parsedSlides }, { status: 200 });
  } catch (err: any) {
    console.error("Error:", err.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
