/* eslint-disable @typescript-eslint/no-explicit-any */
import pptxgen from "pptxgenjs";

interface TextItem {
  text: string;
  [key: string]: any;
}

interface TextConfig {
  text: string | (string | TextItem)[];
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  fontFace?: string;
  bold?: boolean;
  align?: "left" | "center" | "right";
  valign?: "top" | "middle" | "bottom";
  color?: string;
  bullet?: boolean;
  margin?: number[];
  lineHeight?: number;
  [key: string]: any;
}

interface ChartConfig {
  chartType: "bar" | "pie" | "doughnut" | "line";
  x: number;
  y: number;
  w: number;
  h: number;
  data: {
    series: {
      name: string;
      labels: string[];
      values: (number | string)[];
    }[];
  };
  chartColors?: string[];
  showLegend?: boolean;
  legendPos?: string;
  showPercent?: boolean;
  smooth?: boolean;
  [key: string]: any;
}

interface TableCellObj {
  text: string;
  options?: Record<string, any>;
}

interface TableConfig {
  x: number;
  y: number;
  w: number;
  colW?: number[];
  fontSize?: number;
  border?: { pt: number; color: string };
  data: (string | TableCellObj)[][];
  [key: string]: any;
}

type ObjectConfig = TextConfig | ChartConfig | TableConfig;

interface SlideObject {
  type: "text" | "chart" | "table";
  config: ObjectConfig;
}

interface SlideData {
  type: string;
  slideImage?: string;
  objects: SlideObject[];
}

type PresentationConfig = {
  template: string;
  slides: SlideData[];
};

function normalizeBulletArray(
  arr: (string | TextItem)[]
): { text: string; options?: Record<string, any> }[] {
  return arr.map((item) => {
    if (typeof item === "string") {
      return { text: item }; // wrap string in object
    }
    const { text, ...styles } = item;
    return Object.keys(styles).length > 0
      ? { text, options: styles }
      : { text };
  });
}

// Normalize table data for pptxgenjs
function normalizeTableData(
  data: (string | TableCellObj)[][]
): (string | TableCellObj)[][] {
  return data.map((row) =>
    row.map((cell) => {
      if (typeof cell === "string") return cell;
      if (typeof cell === "object" && cell.text) {
        if (!cell.options) cell.options = {};
        return cell;
      }
      return String(cell);
    })
  );
}

// Helper to set slide background (color hex, base64, or URL)
function setSlideBackground(slide: any, bg?: string) {
  if (!bg) {
    slide.background = { color: "FFFFFF" };
    return;
  }
  if (bg.startsWith("data:")) {
    slide.background = { data: bg };
  } else if (bg.startsWith("http")) {
    slide.background = { path: bg };
  } else {
    slide.background = { color: bg.replace(/^#/, "") };
  }
}

export async function generatePresentation(
  jsonConfig: PresentationConfig,
  fileName = "presentation.pptx"
): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";

  console.log(jsonConfig.slides);
  jsonConfig.slides.forEach((slideData) => {
    const slide = pptx.addSlide();
    setSlideBackground(slide, undefined);
    // slideData.slideImage
    slideData.objects.forEach(({ type, config }) => {
      switch (type) {
        case "text": {
          const c = config as TextConfig;
          if (Array.isArray(c.text)) {
            // Normalize bullet array to avoid pptxgenjs error
            const normalizedText = normalizeBulletArray(c.text);
            slide.addText(normalizedText, {
              ...c,
              text: undefined,
              bullet: true,
            });
          } else {
            slide.addText(c.text, { ...c, text: undefined });
          }
          break;
        }
        case "chart": {
          const c = config as ChartConfig;
          slide.addChart(c.chartType, c.data.series, {
            ...c,
            chartType: undefined,
            data: undefined,
          });
          break;
        }
        case "table": {
          const c = config as TableConfig;
          const normalizedData = normalizeTableData(c.data);
          slide.addTable(normalizedData, { ...c, data: undefined });
          break;
        }
      }
    });
  });

  await pptx.writeFile({ fileName });
}
