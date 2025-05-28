import { getDocumentProxy } from "unpdf";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const pdfFile = formData.get("pdfFile");
    const pagesWithImagesStr = formData.get("pagesWithImages");

    if (!(pdfFile instanceof Blob) || typeof pagesWithImagesStr !== "string") {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const pdfBuffer = new Uint8Array(await pdfFile.arrayBuffer());
    const pagesWithImages: number[] = JSON.parse(pagesWithImagesStr);

    const pdf = await getDocumentProxy(pdfBuffer); // unpdf uses legacy build internally

    const imagesByPage: Record<number, string[]> = {};

    for (const pageNum of pagesWithImages) {
      const page = await pdf.getPage(pageNum);
      const images = await page.extractImages();

      const base64Images = images.map((imgBuffer) =>
        Buffer.from(imgBuffer).toString("base64")
      );

      imagesByPage[pageNum] = base64Images;
    }

    return NextResponse.json(imagesByPage);
  } catch (error: any) {
    console.error("Error extracting images:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
