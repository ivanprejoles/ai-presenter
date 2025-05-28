import { cn } from "@/lib/utils";

export type PresentationStyle = {
  id: string;
  name: string;
  description: string;
  className: string;
};

interface StyleSelectorProps {
  styles: PresentationStyle[];
  selectedStyleId: string | null;
  onSelect: (styleId: string) => void;
}

const StyleSelector = ({
  styles,
  selectedStyleId,
  onSelect,
}: StyleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
      {styles.map((style) => (
        <div
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={cn(
            "flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all",
            selectedStyleId === style.id
              ? "bg-primary/10 border border-primary"
              : "bg-background hover:bg-secondary border border-border hover:border-primary/50"
          )}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-2",
              style.className
            )}
          >
            <span className="text-2xl font-bold">A</span>
          </div>
          <h3 className="text-sm font-medium">{style.name}</h3>
          <p className="text-xs text-muted-foreground text-center mt-1">
            {style.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StyleSelector;
