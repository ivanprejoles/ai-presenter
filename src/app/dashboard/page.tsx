"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  ChevronRight,
  Brain,
  Loader2,
  CheckCircle,
  Eye,
} from "lucide-react";
import FileUploader from "@/components/global/Dashboard/UserFileUploader";
import TemplateSelector from "@/components/global/Dashboard/TemplateSelector";
import StyleSelector from "@/components/global/Dashboard/StyleSelector";
import { presentationStyles } from "@/lib/constants";
import { presentationTemplates } from "@/lib/constants/slideType";
import { extractTextFromFile } from "@/lib/utils/fileProcessing";
import axios from "axios";
import { imageTemplates } from "@/lib/constants/imageTemplates";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { truncateText } from "@/lib/utils";
import { renderCategorizedOutput } from "@/lib/constants/analyzedData";
import { AnalyzedData } from "@/lib/types";
import { generatePresentation } from "@/lib/utils/automatePresentation";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzedData, setAnalyzedData] = useState<null | AnalyzedData>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalyzedData(null);
    setSelectedTemplate(null);
    setSelectedStyle(null);
    setTimeout(() => {
      setActiveTab("template");
    }, 500);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const showError = (title: string, description: string) => {
    toast({ title, description, variant: "destructive" });
  };

  const handleCreatePresentation = async () => {
    if (!selectedFile) {
      showError("No file selected", "Please upload a document first.");
      return;
    }

    if (!analyzedData) {
      showError("No data analyzed", "Please analyze the document first.");
      return;
    }

    if (!selectedTemplate) {
      showError(
        "No template selected",
        "Please select a presentation template."
      );
      return;
    }

    if (!selectedStyle) {
      showError("No style selected", "Please select a presentation style.");
      return;
    }

    setIsGenerating(true);
    toast({
      title: "Processing started",
      description:
        "We're generating your presentation. This may take a few minutes.",
    });

    try {
      const { data: presentationData } = await axios.post("/api/ai-present", {
        analyzedData: analyzedData,
        selectedTemplate: presentationTemplates[selectedTemplate],
        imageTemplates,
      });

      generatePresentation(presentationData.result);

      toast({
        title: "Success",
        description: "Your presentation has been successfully generated!",
      });

      // You might want to store/use `presentationData` here
    } catch (error) {
      console.error("❌ Error generating presentation:", error);
      showError("Generation failed", "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      showError("No file selected", "Please upload a document first.");
      return;
    }

    if (!selectedTemplate) {
      showError(
        "No template selected",
        "Please select a presentation template."
      );
      return;
    }

    setIsGenerating(true);

    try {
      const extractedData = await extractTextFromFile(selectedFile);

      const { data: analyzedData } = await axios.post("/api/ai-extract", {
        extractedData,
        selectedTemplate: presentationTemplates[selectedTemplate],
      });

      setAnalyzedData(analyzedData.result);
    } catch (err) {
      console.error("Analysis failed:", err);
      showError("Extraction failed", "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isNextButtonDisabled = () => {
    switch (activeTab) {
      case "upload":
        return !selectedFile;
      case "template":
        return !selectedTemplate;
      case "style":
        return !selectedStyle;
      default:
        return false;
    }
  };

  const moveToNextTab = () => {
    if (activeTab === "upload" && selectedFile) {
      setActiveTab("template");
    } else if (activeTab === "template" && selectedTemplate) {
      setActiveTab("style");
    } else if (activeTab === "style" && selectedStyle) {
      handleCreatePresentation();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-grow">
        <div className="container px-4 md:px-6 max-w-5xl">
          <Card className="border-secondary shadow-md py-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="upload" disabled={isGenerating}>
                  <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline">1.</span>
                    <span>Upload</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="template"
                  disabled={!selectedFile || isGenerating}
                >
                  <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline">2.</span>
                    <span>Template</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="style"
                  disabled={!selectedTemplate || isGenerating}
                >
                  <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline">3.</span>
                    <span>Style</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-6 py-4">
                <TabsContent value="upload" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Upload your document</h2>
                    <p className="text-muted-foreground">
                      Select a PDF, Word document, or PowerPoint file to convert
                      into a presentation.
                    </p>
                  </div>
                  <FileUploader
                    currentFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    className="h-[280px] flex items-center justify-center"
                  />
                </TabsContent>

                <TabsContent value="template" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Choose a template</h2>
                    <p className="text-muted-foreground">
                      Select a design template for your presentation.
                    </p>
                  </div>
                  <TemplateSelector
                    templates={presentationTemplates}
                    selectedTemplateId={selectedTemplate}
                    onSelect={handleTemplateSelect}
                  />
                </TabsContent>

                {/* analysis */}
                <TabsContent value="style" className="space-y-6 mt-0">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Pick a style</h2>
                    <p className="text-muted-foreground">
                      Choose the tone and style for your presentation.
                    </p>
                  </div>
                  <StyleSelector
                    styles={presentationStyles}
                    selectedStyleId={selectedStyle}
                    onSelect={handleStyleSelect}
                  />
                  {/* Analysis Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="mr-2 h-5 w-5" />
                        Document Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            Selected File:
                          </p>
                          <p className="font-medium">
                            {truncateText(
                              selectedFile?.name || "No file selected"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Template:</p>
                          <p className="font-medium">
                            {selectedTemplate
                              ? truncateText(
                                  presentationTemplates[selectedTemplate].type
                                )
                              : "Not selected"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Style:</p>
                          <p className="font-medium">
                            {presentationStyles.find(
                              (s) => s.id === selectedStyle
                            )?.name || "Not selected"}
                          </p>
                        </div>
                      </div>
                      {/* 
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )} */}

                      <Button
                        onClick={handleAnalyze}
                        disabled={
                          !selectedFile || !selectedTemplate || isGenerating
                        }
                        className="w-full"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Document...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Analyze Document
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                  <div className="p-6 pt-0 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (activeTab === "template") setActiveTab("upload");
                        if (activeTab === "style") setActiveTab("template");
                      }}
                      disabled={activeTab === "upload" || isGenerating}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={moveToNextTab}
                      disabled={isNextButtonDisabled() || isGenerating}
                      className={activeTab === "style" ? "gradient-bg" : ""}
                    >
                      {isGenerating ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {activeTab === "style"
                            ? "Create Presentation"
                            : "Next"}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                  {/* Analysis Results */}
                  {analyzedData ? (
                    <div className="space-y-4">
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Analysis complete! Found{" "}
                          {Object.keys(analyzedData).length} sections in your
                          document.
                        </AlertDescription>
                      </Alert>

                      <div className="grid gap-4">
                        {analyzedData.slides.map((slide, index) => (
                          <Card
                            key={index}
                            className="border-l-4 border-l-primary"
                          >
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center">
                                  <FileText className="mr-2 h-5 w-5" />
                                  Slide {index + 1}: {slide.title}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {slide.title}
                                </Badge>
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {slide.description}
                              </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground mb-3">
                                  Content:
                                </h4>
                                <div className="bg-muted/50 rounded-md p-4">
                                  {renderCategorizedOutput(
                                    slide.categorizedOutput
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Eye className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="font-medium text-muted-foreground mb-2">
                        Ready to analyze your document
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Click the &quot;Analyze Document&quot; button above to
                        extract and process content from your file.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Easy Upload</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your documents or browse to select from your
                computer
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Professional Templates</h3>
              <p className="text-sm text-muted-foreground">
                Choose from a variety of professionally designed presentation
                templates
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your content and creates beautifully formatted
                slides
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-secondary/25">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
            <p className="text-xs text-gray-500">
              © 2025 SlideCraft AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
