import React, { useCallback, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload = ({ onFileSelected, isProcessing }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
        }
      }
    },
    []
  );

  const validateFile = (file: File): boolean => {
    const acceptedFormats = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!acceptedFormats.includes(file.type)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF, Excel, Word, or CSV file.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 25MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  }, [selectedFile, onFileSelected]);

  return (
    <Card
      className={`p-6 border-2 ${
        isDragging
          ? "border-primary border-dashed bg-primary/5"
          : "border-dashed"
      } transition-all duration-200`}
    >
      <div
        className="flex flex-col items-center justify-center w-full py-8"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {!selectedFile ? (
          <>
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload your document</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Drag and drop or click to upload PDFs, spreadsheets, or text
              documents
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Max file size: 25MB
            </p>
            <Button
              onClick={() => document.getElementById("file-input")?.click()}
              variant="outline"
              className="relative"
            >
              Choose File
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="sr-only"
                accept=".pdf,.xls,.xlsx,.csv,.txt,.doc,.docx"
                disabled={isProcessing}
              />
            </Button>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50 mb-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleUpload} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Analyze Document"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;
