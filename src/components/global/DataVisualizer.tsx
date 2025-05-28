import React, { useState } from "react";
import { VisualizationData } from "@/lib/types";
import VisualizerCard from "./VisualizerCard";
import {
  AlertCircle,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";

interface DataVisualizerProps {
  visualizations: VisualizationData[];
}

const DataVisualizer = ({ visualizations }: DataVisualizerProps) => {
  const [layout, setLayout] = useState<"grid" | "list" | "cards">("cards");

  if (!visualizations || visualizations.length === 0) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No visualizations available</AlertTitle>
          <AlertDescription>
            We couldn&apos;t generate visualizations from the uploaded content.
            Try uploading a file with more structured data like tables, numbers,
            or lists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Group visualizations by type
  const chartTypes = [...new Set(visualizations.map((v) => v.type))];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Generated {visualizations.length} visualizations based on the
          extracted data. Each visualization represents key insights from your
          document.
        </p>

        <div className="flex items-center space-x-2">
          <Button
            variant={layout === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("cards")}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="sr-only">Cards View</span>
          </Button>
          <Button
            variant={layout === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid View</span>
          </Button>
          <Button
            variant={layout === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("list")}
          >
            <LayoutList className="h-4 w-4" />
            <span className="sr-only">List View</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 flex flex-nowrap overflow-x-auto">
          <TabsTrigger value="all">All Visualizations</TabsTrigger>
          {chartTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Charts
              <span className="ml-2 rounded-full bg-primary/10 px-2 text-xs">
                {visualizations.filter((v) => v.type === type).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : layout === "list"
                  ? "space-y-6"
                  : "grid grid-cols-1 gap-8"
            }
          >
            {visualizations.map((visualization) => (
              <VisualizerCard
                key={visualization.id}
                visualization={visualization}
              />
            ))}
          </div>
        </TabsContent>

        {chartTypes.map((type) => (
          <TabsContent key={type} value={type}>
            <div
              className={
                layout === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : layout === "list"
                    ? "space-y-6"
                    : "grid grid-cols-1 gap-8"
              }
            >
              {visualizations
                .filter((v) => v.type === type)
                .map((visualization) => (
                  <VisualizerCard
                    key={visualization.id}
                    visualization={visualization}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DataVisualizer;
