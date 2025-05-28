/**
 *  WIP : Image Extract, Blob size always 0, cant catch blob data
 * */
// if (file.type === "application/pdf") {
//   // Read file as ArrayBuffer
//   const arrayBuffer = await file.arrayBuffer();
//   console.log("ArrayBuffer size:", arrayBuffer.byteLength);

//   // Use pdfjs-dist to extract pagesWithImages and pagesText
//   const pdfjs = (window as any).pdfjsLib as typeof import("pdfjs-dist");
//   pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.mjs";
//   const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) })
//     .promise;

//   const pagesWithImages: number[] = [];
//   const pagesText: Record<number, string> = {};

//   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const textContent = await page.getTextContent();
//     pagesText[pageNum] = textContent.items
//       .map((item: any) => item.str)
//       .join(" ");

//     const opList = await page.getOperatorList();
//     const hasImage = opList.fnArray.some(
//       (fn) =>
//         fn === pdfjs.OPS.paintImageXObject || fn === pdfjs.OPS.paintXObject
//     );
//     if (hasImage) pagesWithImages.push(pageNum);
//   }

//   // Create a Blob from the ArrayBuffer
//   const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });
//   console.log("PDF Blob:", pdfBlob);
//   console.log("PDF Blob size:", pdfBlob.size);

//   // Prepare FormData for sending to a server (example)
//   const formData = new FormData();
//   formData.append("pdfFile", pdfBlob, file.name);
//   formData.append("pagesWithImages", JSON.stringify(pagesWithImages));
//   formData.append("pagesText", JSON.stringify(pagesText));
//   console.log(formData);
//   // Send to server
//   const response = await fetch("/api/extract-images", {
//     method: "POST",
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error(`Upload failed: ${response.statusText}`);
//   }

//   // Assume server returns images keyed by page number
//   const imagesByPage: Record<number, string[]> = await response.json();

//   // Combine text and images per page
//   const pagesData: Record<number, { text: string; images: string[] }> = {};
//   for (const pageNumStr of Object.keys(pagesText)) {
//     const pageNum = Number(pageNumStr);
//     pagesData[pageNum] = {
//       text: pagesText[pageNum],
//       images: imagesByPage[pageNum] || [],
//     };
//   }

//   return pagesData;
// }

/**
 *  WIP : Original Approach to extract text, working with pdfjs-dist
 * */

// // PDF (using pdf2json)
// if (file.type === "application/pdf") {
//   if (typeof window === "undefined" || !("pdfjsLib" in window)) {
//     return "PDF.js library is not loaded on the client.";
//   }

//   const pdfjs = (window as any)
//     .pdfjsLib as typeof import("pdfjs-dist/types/src/pdf");
//   const workerSrc = "/pdfjs/pdf.worker.mjs";

//   pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

//   const loadingTask = pdfjs.getDocument({ data: fileBuffer });
//   const pdf = await loadingTask.promise;

//   let fullText = "";

//   for (let i = 0; i < pdf.numPages; i++) {
//     const page = await pdf.getPage(i + 1);
//     const content = await page.getTextContent();
//     const strings = content.items.map((item: any) => item.str);
//     fullText += strings.join(" ") + "\n";
//   }

//   return fullText;
// }
