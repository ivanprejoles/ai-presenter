import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TemplateType } from "@/lib/types";

interface TemplateSelectorProps {
  templates: TemplateType;
  selectedTemplateId: string | null;
  onSelect: (templateId: string) => void;
}

const TemplateSelector = ({
  templates,
  selectedTemplateId,
  onSelect,
}: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {Object.entries(templates).map(([key, value]) => (
        <div
          key={key}
          onClick={() => onSelect(key)}
          className={cn(
            "relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200",
            selectedTemplateId === key
              ? "border-primary ring-2 ring-primary ring-opacity-50 shadow-lg"
              : "border-border hover:border-primary/50"
          )}
        >
          {selectedTemplateId === key && (
            <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-md">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
          <div className="aspect-video w-full bg-muted/50">
            {/* <img
              src={"/template.avif"}
              alt={value.type}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback image if the template image fails to load
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            /> */}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm">{value.type}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {value.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;
