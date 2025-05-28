/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ExtractedData {
  summary: string;
  facts: DataFact[];
  rawText: string;
}

export interface DataFact {
  id: string;
  description: string;
  value: number | string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface VisualizationData {
  id: string;
  title: string;
  description: string;
  type: "bar" | "line" | "pie" | "area" | "scatter" | "table";
  data: any[];
  config?: Record<string, any>;
}

export interface AnalysisResult {
  summary: string;
  facts: DataFact[];
  visualizations: VisualizationData[];
}

export interface ApiErrorResponse {
  error: string;
  status: number;
}

// export interface TemplateType {
//   id: string;
//   name: string;
//   description: string;
//   imageSrc: string;
//   style:
//     | "informative"
//     | "instructional"
//     | "inspiring"
//     | "convincing"
//     | "analytical";
//   slides: { title: string; description: string }[];
// }

export interface SlideType {
  title: string;
  description: string;
  categorizedOutput: string;
}

export interface TemplateType {
  [style: string]: {
    type: string;
    description: string;
    slides: SlideType[];
  };
}

export interface AnalyzedData {
  type: string;
  description: string;
  slides: Array<{
    title: string;
    description: string;
    categorizedOutput: any; // Can be string, string[], object[], etc.
  }>;
}
