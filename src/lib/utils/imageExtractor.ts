import { getDocumentProxy } from "unpdf";
import fs from "fs";

export async function extractImagesFromPages(pdfBuffer, pagesWithImages) {
  // Load PDF document using unpdf
  const pdf = await getDocumentProxy(pdfBuffer);

  const imagesByPage = {};

  for (const pageNum of pagesWithImages) {
    const page = await pdf.getPage(pageNum);

    // Extract images from this page
    // unpdf's extractImages method returns an array of images (ArrayBuffers or base64)
    const images = await page.extractImages();

    // Convert ArrayBuffers to base64 strings for easy transfer (if needed)
    const base64Images = images.map((imgBuffer) =>
      Buffer.from(imgBuffer).toString("base64")
    );

    imagesByPage[pageNum] = base64Images;
  }

  return imagesByPage; // { pageNum: [base64Image1, base64Image2, ...], ... }
}
