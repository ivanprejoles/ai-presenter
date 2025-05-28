import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import type { AnalysisResult, ExtractedData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read the file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Extract data using Gemini
    const extractedData = await extractDataWithGemini(file, fileBuffer);

    // Analyze the extracted data
    const analysisResult = await analyzeWithGemini(extractedData);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error analyzing document:", error);
    return NextResponse.json(
      { error: "Failed to analyze document" },
      { status: 500 }
    );
  }
}

async function extractDataWithGemini(
  file: File,
  fileBuffer: ArrayBuffer
): Promise<ExtractedData> {
  // Convert ArrayBuffer to Buffer for file handling
  const buffer = Buffer.from(fileBuffer);

  // Extract text and data from document using Gemini
  const { text: extractionResult } = await generateText({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: 'Extract the following from this document: 1) A comprehensive summary, 2) Key facts and findings, 3) All quantitative data and measurements with their context. Format the response as JSON with these keys: "summary", "facts" (array), "quantitativeData" (array of objects with "value", "unit", "context", "category").',
          },
          {
            type: "file",
            data: buffer,
            mimeType: file.type,
          },
        ],
      },
    ],
  });

  try {
    // Parse the JSON response
    const parsedData = JSON.parse(extractionResult);

    return {
      summary: parsedData.summary,
      facts: parsedData.facts,
      quantitativeData: parsedData.quantitativeData,
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to parse extracted data");
  }
}

async function analyzeWithGemini(
  extractedData: ExtractedData
): Promise<AnalysisResult> {
  const { text: analysisResult } = await generateText({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "user",
        content: `Analyze the following extracted data and provide insights, potential issues, and recommendations.
        Summary: ${extractedData.summary}
        Facts: ${JSON.stringify(extractedData.facts)}
        Quantitative Data: ${JSON.stringify(extractedData.quantitativeData)}
        
        Format the response as JSON with the following keys: "insights", "potentialIssues", "recommendations".`,
      },
    ],
  });

  try {
    const parsedAnalysis = JSON.parse(analysisResult);
    return {
      insights: parsedAnalysis.insights,
      potentialIssues: parsedAnalysis.potentialIssues,
      recommendations: parsedAnalysis.recommendations,
    };
  } catch (error) {
    console.error("Error parsing Gemini analysis response:", error);
    throw new Error("Failed to parse analysis result");
  }
}
