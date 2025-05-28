/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle, CheckCircle } from "lucide-react";

export const renderCategorizedOutput = (output: any) => {
  if (!output) {
    return <p className="text-muted-foreground italic">No content available</p>;
  }

  // Handle string type
  if (typeof output === "string") {
    return <p className="text-sm leading-relaxed">{output}</p>;
  }

  // Handle string array
  if (
    Array.isArray(output) &&
    output.length > 0 &&
    typeof output[0] === "string"
  ) {
    return (
      <ul className="space-y-2">
        {output.map((item: string, index: number) => (
          <li key={index} className="flex items-start">
            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
            <span className="text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Handle object array with title and content
  if (
    Array.isArray(output) &&
    output.length > 0 &&
    typeof output[0] === "object" &&
    "title" in output[0]
  ) {
    return (
      <div className="space-y-4">
        {output.map((item: any, index: number) => (
          <div key={index} className="border-l-2 border-primary/30 pl-4">
            <h5 className="font-medium text-sm mb-2">{item.title}</h5>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Handle chart data
  if (
    Array.isArray(output) &&
    output.length > 0 &&
    "name" in output[0] &&
    "labels" in output[0]
  ) {
    return (
      <div className="space-y-3">
        {output.map((chart: any, index: number) => (
          <div key={index} className="p-3 bg-background rounded border">
            <h5 className="font-medium text-sm mb-2">{chart.name}</h5>
            <div className="text-xs text-muted-foreground">
              <p>Labels: {chart.labels.join(", ")}</p>
              <p>Values: {chart.values.join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle comparison data
  if (
    typeof output === "object" &&
    "contentA" in output &&
    "contentB" in output
  ) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium text-sm mb-2 text-green-700">Do&apos;s</h5>
          <ul className="space-y-1">
            {output.contentA.map((item: string, index: number) => (
              <li key={index} className="text-sm flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-medium text-sm mb-2 text-red-700">Don&apos;ts</h5>
          <ul className="space-y-1">
            {output.contentB.map((item: string, index: number) => (
              <li key={index} className="text-sm flex items-start">
                <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
};
