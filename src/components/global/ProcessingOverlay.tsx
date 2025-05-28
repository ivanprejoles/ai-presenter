import React from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingOverlayProps {
  currentStep: string;
  progress: number;
}

const ProcessingOverlay = ({
  currentStep,
  progress,
}: ProcessingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Processing your document</h3>
          <p className="text-sm text-muted-foreground">{currentStep}</p>

          <div className="w-full space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground text-right">
              {Math.round(progress)}%
            </p>
          </div>

          <p className="text-sm italic text-muted-foreground mt-6">
            This may take a few minutes depending on the size and complexity of
            your document.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
