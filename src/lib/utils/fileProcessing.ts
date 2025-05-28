// import { ExtractedData, DataFact } from "@/types";
// utils/extractTextFromFile.ts
import mammoth from "mammoth";
import * as XLSX from "xlsx";

export async function extractTextFromFile(file: File): Promise<
  | Record<
      number,
      {
        text: string;
        images: string[];
      }
    >
  | string
> {
  const fileBuffer = await file.arrayBuffer();

  if (file.type === "application/pdf") {
    // Load pdfjsLib and set worker source
    const pdfjs = (window as any).pdfjsLib as typeof import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.mjs";

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) })
      .promise;

    const pagesData: Record<number, { text: string; images: string[] }> = {};

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Create page entry with text and empty images array
      pagesData[pageNum] = {
        text: textContent.items.map((item: any) => item.str).join(" "),
        images: [], // Empty array for now (you'll add images later)
      };
    }

    return pagesData;
  }

  // Word DOCX - wrap raw text as page 1
  if (file.type.includes("word") || file.name.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
    return { 1: { text: value, images: [] } };
  }

  // Excel / CSV - wrap CSV text as page 1
  if (
    file.type.includes("spreadsheet") ||
    file.type.includes("excel") ||
    file.name.endsWith(".csv") ||
    file.name.endsWith(".xlsx")
  ) {
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const text = XLSX.utils.sheet_to_csv(sheet);
    return { 1: { text, images: [] } };
  }

  // Plain text - wrap as page 1
  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    const text = await file.text();
    return { 1: { text, images: [] } };
  }
  return "Unsupported file type.";
}
