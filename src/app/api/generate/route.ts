import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { extractedData } = await req.json();
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const config = {
      responseMimeType: "text/plain",
    };

    const model = "gemini-1.5-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `You are a helpful AI presentation assistant. You will receive raw text from a research paper, business report, study paper, CSV export, or user-submitted content.

🎯 Your task:
- Analyze the content deeply and extract **only the most important, impactful points** from all pages.
- Create a **presentation-ready structure** using a concise, slide-friendly format.
- Use all relevant data wisely - do **not ignore or waste** information that could enrich the message.
- Support 5 visual types: bar, line, pie, doughnut, and table.
- Maintain design consistency across slides.

📊 Visual Field Naming Rules:
- For **bar**, **line**, and **table** charts, always use \`Category\` for the category/key field and \`Value\` for the numeric value field.
- For **pie** and **doughnut** charts, provide \`labels\` and \`values\` arrays.
- For **image_with_caption** slides, only generate them if there are images on that page. Use the image name exactly as given (e.g., "img1.png", "chart2.svg") in the \`imageName\` field.

📦 Format:
Return an **array of slide objects as JSON** like this:

[
  {
    "type": "title",
    "title": "Your Slide Title",
    "content": ["Subtext or author, optional"]
  },
  {
    "type": "agenda",
    "title": "Agenda",
    "content": ["Intro", "Key Findings", "Conclusion"]
  },
  {
    "type": "objectives",
    "title": "Learning Objectives",
    "content": [
      "Understand the impact of AI on hiring",
      "Learn how the system rates candidates",
      "Review visualized applicant performance"
    ]
  },
  {
    "type": "image_with_caption",
    "title": "// Caption title",
    "imageName": "chart2.svg",       
    "caption": "This image shows sales growth over the last quarter."
  },
  {
    "type": "key_points",
    "title": "Key Messages",
    "content": [
      "AI reduces hiring bias and speeds up review",
      "Visual summaries help HR make faster decisions"
    ]
  },
  {
    "type": "visual",
    "title": "Candidate Scores by Category",
    "visualData": {
      "type": "bar",
      "x": "Category",
      "y": "Value",
      "data": [
        { "Category": "Code Quality", "Value": 87 },
        { "Category": "Communication", "Value": 92 }
      ],
      "labels": ["Code Quality", "Communication"],
      "values": [87, 96],
      "options": {
        "colors": ["#FF6B6B", "#4ECDC4"],
        "showPercent": true
      }
    }
  },
  {
    "type": "conclusion",
    "title": "Conclusion",
    "content": [
      "This AI tool can reshape how companies evaluate developers.",
      "Immediate next steps include onboarding beta users and improving accuracy."
    ]
  }
]

📚 Content Source:
Each page is provided as an object with \`text\` and optional \`images\`. If the \`images\` array is empty, do NOT generate any image-related slides for that page. If one or more image names are present, include an \`image_with_caption\` slide using each image.

Now analyze this content and generate the presentation:
${JSON.stringify(extractedData, null, 2)}`,
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
