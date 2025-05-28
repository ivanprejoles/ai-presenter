"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Upload, File, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Element } from "react-scroll";
import { useToast } from "@/hooks/use-toast";
import { extractTextFromFile } from "@/lib/utils/fileProcessing";
import axios from "axios";
import generatePresentation from "@/lib/utils/pptGenerator";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { imageUrlToBase64 } from "@/lib/utils/ImageConverter";
import { validateFile } from "@/lib/utils/fileValidator";

export function FileUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile, toast)) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile, toast)) {
      setFile(selectedFile);
    }
  };

  // convex file storage
  const imageUrl = useQuery(api.images.getImageUrl, {
    storageId: "kg2aw4fd4p8kc0ppvknkrx802n7fssvz" as Id<"_storage">,
  });

  const handleUpload = async () => {
    if (!file || !imageUrl) return;

    setUploading(true);
    // convex image background
    const base64DataUrl = await imageUrlToBase64(imageUrl);
    // extract data from file
    const extractedData = await extractTextFromFile(file);
    console.log(extractedData);

    await axios
      .post("/api/generate", { extractedData })
      .then((response) => {
        generatePresentation(response.data, base64DataUrl);
      })
      .finally(() => {
        toast({
          title: "Analysis complete",
          description: "Your document has been successfully analyzed",
        });
        setUploading(false);
        setFile(null);
      });
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Element name="upload">
      <section id="upload" className="py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Upload Your File
          </h2>
          <p className="mb-12 text-lg text-gray-400">
            We support PDFs, PowerPoint, Word documents, and more. Our AI will
            analyze your content and create a beautiful presentation.
          </p>

          <Card className="border-2 border-dashed border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div
                className={cn(
                  "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg transition-colors",
                  dragActive
                    ? "bg-purple-900/20"
                    : "bg-gray-800/30 hover:bg-gray-800/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.csv,.xls,.xlsx"
                />

                {!file ? (
                  <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                    <div className="rounded-full bg-purple-900/30 p-4">
                      <FileUp className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-gray-400">
                        or click to browse your files
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Supports PDF, DOC, DOCX, TXT, CSV, XLS, XLSX
                    </p>
                  </div>
                ) : (
                  <div className="flex w-full flex-col items-center space-y-4 p-8">
                    <div className="flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-blue-900/30 p-2">
                          <File className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{file.name}</p>
                          <p className="text-sm text-gray-400">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpload();
                      }}
                      disabled={uploading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Convert to Presentation
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Element>
  );
}
