// "use client";

// import pptxgen from "pptxgenjs";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ProcessingOverlay from "@/components/global/ProcessingOverlay";
// import Summary from "@/components/global/Summary";
// import DataVisualizer from "@/components/global/DataVisualizer";
// import ExportPresentation from "@/components/global/ExportPresentation";
// import { extractTextFromFile } from "@/lib/utils/fileProcessing";
// import { AnalysisResult } from "@/lib/types";
// import { useToast } from "@/hooks/use-toast";
// import FileUpload from "../FIleUpload";
// import generatePresentation from "@/lib/utils/pptGenerator";

// const ClientSidePage = () => {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processStep, setProcessStep] = useState("");
//   const [progress, setProgress] = useState(0);
//   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
//     null
//   );
//   const [documentTitle, setDocumentTitle] = useState("");
//   const [isExporting, setIsExporting] = useState(false);
//   const [activeTab, setActiveTab] = useState("summary");
//   const { toast } = useToast();

//   useEffect(() => {
//     // Load PDF.js
//     const pdfScript = document.createElement("script");
//     pdfScript.type = "module";
//     pdfScript.src = "/pdfjs/pdf.mjs";
//     document.body.appendChild(pdfScript);
//     // Optional: cleanup if needed
//     return () => {
//       document.body.removeChild(pdfScript);
//     };
//   }, []);

//   const handleFileSelected = async (file: File) => {
//     try {
//       setIsProcessing(true);
//       setDocumentTitle(file.name);

//       // Step 1: Extract text from the file
//       setProcessStep("Extracting text from document...");
//       setProgress(10);
//       const extractedData = await extractTextFromFile(file);

//       // Step 2: Process the file content
//       setProcessStep("Processing document content...");
//       setProgress(30);
//       // const extractedData = await simulateFileProcessing(file);

//       // Step 3: Analyze with Gemini AI
//       setProcessStep("Analyzing with Gemini AI...");
//       setProgress(60);
//       await axios
//         .post("/api/generate", { extractedData })
//         .then((response) => {
//           generatePresentation(response.data);
//         })
//         .finally(() => {
//           // setAnalysisResult(result);
//           setProgress(100);
//           setActiveTab("summary");
//           toast({
//             title: "Analysis complete",
//             description: "Your document has been successfully analyzed",
//           });
//         });
//     } catch (error) {
//       console.error("Error processing file:", error);
//       toast({
//         title: "Processing failed",
//         description:
//           error instanceof Error ? error.message : "An unknown error occurred",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // const handleExport = async () => {
//   //   if (!analysisResult) return;

//   //   try {
//   //     setIsExporting(true);

//   //     // Generate the presentation
//   //     const presentationBlob = await generatePresentation(
//   //       analysisResult,
//   //       documentTitle
//   //     );

//   //     // Create a download link
//   //     const url = URL.createObjectURL(presentationBlob);
//   //     const a = document.createElement("a");
//   //     a.href = url;
//   //     a.download = `${documentTitle.split(".")[0]}_presentation.pptx`;
//   //     document.body.appendChild(a);
//   //     a.click();

//   //     // Clean up
//   //     document.body.removeChild(a);
//   //     URL.revokeObjectURL(url);

//   //     toast({
//   //       title: "Export complete",
//   //       description: "Your presentation has been downloaded",
//   //     });
//   //   } catch (error) {
//   //     console.error("Error exporting presentation:", error);
//   //     toast({
//   //       title: "Export failed",
//   //       description:
//   //         error instanceof Error ? error.message : "An unknown error occurred",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setIsExporting(false);
//   //   }
//   // };
//   return (
//     <>
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold mb-2">Document Analysis AI</h1>
//           <p className="text-muted-foreground">
//             Upload a document to extract insights and visualize key data points
//           </p>
//         </div>

//         <div className="space-y-6">
//           <FileUpload
//             onFileSelected={handleFileSelected}
//             isProcessing={isProcessing}
//           />

//           {analysisResult && (
//             <div className="space-y-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab}>
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="summary">Summary</TabsTrigger>
//                   <TabsTrigger value="visualizations">
//                     Visualizations
//                   </TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="summary" className="pt-4">
//                   <Summary
//                     summary={analysisResult.summary}
//                     title={documentTitle}
//                   />
//                 </TabsContent>
//                 <TabsContent value="visualizations" className="pt-4">
//                   <DataVisualizer
//                     visualizations={analysisResult.visualizations}
//                   />
//                 </TabsContent>
//               </Tabs>

//               <ExportPresentation
//                 analysisResult={analysisResult}
//                 documentTitle={documentTitle}
//                 isExporting={isExporting}
//                 onExport={() => {}}
//               />
//             </div>
//           )}

//           {!analysisResult && !isProcessing && (
//             <Card className="bg-muted/50">
//               <CardContent className="flex flex-col items-center justify-center py-12">
//                 <p className="text-center text-muted-foreground">
//                   Upload a document to get started
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       {isProcessing && (
//         <ProcessingOverlay currentStep={processStep} progress={progress} />
//       )}
//     </>
//   );
// };

// export default ClientSidePage;
