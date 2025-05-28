import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ExportPresentationProps {
  analysisResult: AnalysisResult;
  documentTitle: string;
  isExporting: boolean;
  onExport: () => void;
}

const ExportPresentation = ({
  analysisResult,
  documentTitle,
  isExporting,
  onExport,
}: ExportPresentationProps) => {
  const { toast } = useToast();

  const handleExport = async () => {
    if (!analysisResult) {
      toast({
        title: "No data to export",
        description: "Please analyze a document first",
        variant: "destructive",
      });
      return;
    }

    onExport();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/50 p-4 rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium">Export as Presentation</h3>
        <p className="text-sm text-muted-foreground">
          Save this analysis as a PowerPoint presentation
        </p>
      </div>
      <Button
        onClick={handleExport}
        disabled={!analysisResult || isExporting}
        className="whitespace-nowrap"
      >
        {isExporting ? (
          <>
            <span className="animate-pulse">Exporting...</span>
          </>
        ) : (
          <>
            <FileDown className="h-4 w-4 mr-2" />
            Export to PPT
          </>
        )}
      </Button>
    </div>
  );
};

export default ExportPresentation;
