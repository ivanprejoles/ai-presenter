import PptxGenJS from "pptxgenjs";

/**
 * Set slide background color or base64 image
 */
function setSlideBackground(slide: PptxGenJS.Slide, background?: string) {
  if (!background) return;
  if (background.startsWith("image/")) {
    slide.background = { data: background };
  } else {
    slide.background = { color: background };
  }
}

/**
 * Add a text block to a slide using given text and options
 */
function addTextBlock(
  slide: PptxGenJS.Slide,
  textConfig: { text: string; options: any }
) {
  if (!textConfig.text) return;
  slide.addText(textConfig.text, textConfig.options);
}

/**
 * Add a table to a slide
 */
function addTable(slide: PptxGenJS.Slide, tableData: any[][], options: any) {
  slide.addTable(tableData, options);
}

/**
 * Map string chart types to PptxGenJS ChartType enum
 */
const chartTypeMap: Record<string, any> = {
  bar: PptxGenJS.ChartType.bar,
  line: PptxGenJS.ChartType.line,
  pie: PptxGenJS.ChartType.pie,
  doughnut: PptxGenJS.ChartType.doughnut,
  table: "table", // special case handled separately
};

/**
 * Main generator function
 * @param templates - your templates object (with background and slides)
 * @param templateName - key of the template to use
 * @param aiSlides - array of AI-provided slides with categorizedType, title, content, and optional chartType
 */
export async function generatePresentationFromTemplate(
  templates: any,
  templateName: string,
  aiSlides: Array<{
    categorizedType: string;
    title: string;
    content: any;
    chartType?: string; // "bar" | "line" | "pie" | "doughnut" | "table"
  }>
) {
  const pptx = new PptxGenJS();
  const template = templates[templateName];
  if (!template) throw new Error(`Template "${templateName}" not found`);

  for (const aiSlide of aiSlides) {
    const slide = pptx.addSlide();

    // Apply background from template (color or base64 image)
    setSlideBackground(slide, template.background);

    // Find corresponding slide config in template by categorizedType and title
    const templateSlide = template.slides.find(
      (s: any) =>
        s.categorizedType === aiSlide.categorizedType &&
        s.title === aiSlide.title
    );

    if (!templateSlide) {
      // Fallback: render JSON stringified content
      slide.addText("Slide config not found for this content", {
        x: 1,
        y: 1,
        w: 8,
        h: 1,
      });
      slide.addText(JSON.stringify(aiSlide.content), {
        x: 1,
        y: 1.5,
        w: 8,
        h: 4,
        fontSize: 12,
        color: "999999",
      });
      continue;
    }

    const chartType = (aiSlide.chartType || "").toLowerCase();

    // Handle chart slides
    if (chartType === "table") {
      // Table expects 2D array data
      addTable(slide, aiSlide.content, {
        x: 1,
        y: 1.5,
        w: 8,
        h: 4,
        ...templateSlide.content?.table?.options,
      });
      continue;
    }

    if (["bar", "line", "pie", "doughnut"].includes(chartType)) {
      const pptxChartType = chartTypeMap[chartType];
      if (!pptxChartType) {
        slide.addText(`Unsupported chart type: ${chartType}`, {
          x: 1,
          y: 1,
          w: 8,
          h: 1,
        });
        continue;
      }

      // For pie/doughnut, PptxGenJS expects a single series object with labels and values
      let chartData = aiSlide.content;
      if (
        (chartType === "pie" || chartType === "doughnut") &&
        Array.isArray(chartData)
      ) {
        chartData = chartData[0] || { labels: [], values: [] };
      }

      slide.addChart(pptxChartType, chartData, {
        x: 1,
        y: 1.5,
        w: 8,
        h: 4,
        showLegend: true,
        showTitle: true,
        title: aiSlide.title,
        showPercent: chartType === "pie" || chartType === "doughnut",
        legendPos: "r",
        ...templateSlide.content?.chart?.options,
      });
      continue;
    }

    // Otherwise, render text blocks dynamically from template slide content config keys
    for (const key in templateSlide.content) {
      if (!templateSlide.content.hasOwnProperty(key)) continue;
      const textBlockConfig = templateSlide.content[key];
      let textValue = "";

      if (typeof aiSlide.content === "object" && aiSlide.content !== null) {
        textValue = aiSlide.content[key] || "";
      } else if (key === "text") {
        textValue = aiSlide.content;
      }

      addTextBlock(slide, {
        text: textValue,
        options: textBlockConfig.options,
      });
    }
  }

  // Save the generated presentation
  await pptx.writeFile("GeneratedPresentation.pptx");
}
