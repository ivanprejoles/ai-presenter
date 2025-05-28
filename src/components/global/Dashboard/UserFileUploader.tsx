import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { validateFile } from "@/lib/utils/fileValidator";

interface FileUploaderProps {
  currentFile: File | null;
  onFileSelect: (file: File) => void;
  className?: string;
  supportedFileTypes?: string;
  maxSizeMB?: number;
}

const FileUploader = ({
  currentFile,
  onFileSelect,
  className,
  supportedFileTypes = ".pdf, .doc, .docx, .ppt, .pptx",
  maxSizeMB = 10,
}: FileUploaderProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(currentFile);
  const { toast } = useToast();


  const handleFile = (file: File) => {
    if (validateFile(file, toast)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragActive) {
        setIsDragActive(true);
      }
    },
    [isDragActive]
  );

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div
      className={cn(
        "w-full relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
        isDragActive ? "border-primary bg-primary/5" : "border-border",
        selectedFile ? "bg-green-50 border-green-200" : "",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleInputChange}
        accept={supportedFileTypes}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        {selectedFile ? (
          <>
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-green-600">
                File selected!
              </p>
              <p className="text-sm text-gray-500">{selectedFile.name}</p>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              variant="outline"
              className="mt-2"
              size="sm"
            >
              Change file
            </Button>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-gentle">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-medium text-lg">Upload your document</p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: {supportedFileTypes}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
