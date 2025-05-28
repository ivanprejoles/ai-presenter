import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SummaryProps {
  summary: string;
  title: string;
}

const Summary = ({ summary, title }: SummaryProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          Document Overview
        </CardTitle>
        <CardDescription>AI-generated summary of {title}</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <ScrollArea className="h-[300px] pr-4">
          <div className="prose prose-sm dark:prose-invert">
            {summary.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-3 text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Summary;
