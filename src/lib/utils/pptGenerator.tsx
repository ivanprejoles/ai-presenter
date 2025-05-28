import pptxgen from "pptxgenjs";
export const COLORS_ACCENT = ["4472C4", "ED7D31", "FFC000", "70AD47"];

// Assuming `result` is your parsed JSON object
const generatePresentation = (data: any, imageUrl: any) => {
  const pptx = new pptxgen();

  // 1. Define Master Template
  pptx.defineSlideMaster({
    title: "RESEARCH_MASTER",
    objects: [
      {
        placeholder: {
          options: {
            name: "title",
            type: "title",
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.6,
          },
          // style: { fontSize: 24, bold: true, color: "2F5496" },
        },
      },
    ],
  });

  // 2. Slide Generation Logic
  data.result.forEach((slide) => {
    const currentSlide = pptx.addSlide("RESEARCH_MASTER");
    currentSlide.background = {
      data: imageUrl,
    };

    // 2a. Always add title
    currentSlide.addText(slide.title, { placeholder: "title" });

    // 2b. Handle Content Types
    switch (slide.type) {
      case "visual":
        handleVisualizations(currentSlide, slide.visualData);
        break;
      default:
        addTextContent(currentSlide, slide.content);
    }
  });

  // 3. Visualization Handler
  function handleVisualizations(slide, visualData) {
    const chartColors = visualData.options?.colors || [
      "#4ECDC4",
      "#45B7D1",
      "#FF6B6B",
    ];

    switch (visualData.type) {
      case "pie": {
        if (
          !Array.isArray(visualData.labels) ||
          !Array.isArray(visualData.values)
        ) {
          console.error("Pie chart requires labels and values arrays");
          return;
        }

        const labelsContainPercent = visualData.labels.some((label) =>
          /\(\d+(\.\d+)?%?\)/.test(label)
        );

        slide.addChart(
          pptx.ChartType.pie,
          [
            {
              name: visualData.title || "",
              labels: visualData.labels,
              values: visualData.values,
            },
          ],
          {
            x: 2,
            y: 1.5,
            w: 6,
            h: 4,
            chartColors: visualData.options?.colors || [
              "#4ECDC4",
              "#45B7D1",
              "#FF6B6B",
            ],
            showDataLabels: true,
            dataLabelFormatCode: labelsContainPercent ? "@" : '0.0"%";;',
            showLegend: visualData.options?.showLegend ?? true,
            legendPos: visualData.options?.legendPos || "r",
            dataLabelColor: visualData.options?.dataLabelColor || "000000",
            dataLabelFontSize: visualData.options?.dataLabelFontSize || 12,
            showLeaderLines: visualData.options?.showLeaderLines ?? false,
            showPercent: true,
          }
        );
        break;
      }

      case "doughnut": {
        if (
          !Array.isArray(visualData.labels) ||
          !Array.isArray(visualData.values)
        ) {
          console.error("Doughnut chart requires labels and values arrays");
          return;
        }

        slide.addChart(
          pptx.ChartType.doughnut,
          [
            {
              name: visualData.title || "",
              labels: visualData.labels,
              values: visualData.values,
            },
          ],
          {
            x: 2,
            y: 1.5,
            w: 6,
            h: 6.4,
            holeSize: visualData.options?.holeSize ?? 70,
            chartColors: visualData.options?.colors || [
              "#FF6B6B",
              "#4ECDC4",
              "#FFD966",
              "#92E6E6",
              "#A7D1AB",
            ],
            dataBorder: visualData.options?.dataBorder || {
              pt: "1",
              color: "F1F1F1",
            },
            showLabel: visualData.options?.showLabel ?? true,
            showValue: visualData.options?.showValue ?? false,
            showPercent: visualData.options?.showPercent ?? true,
            showLegend: visualData.options?.showLegend ?? true,
            legendPos: visualData.options?.legendPos || "r",
            legendColor: visualData.options?.legendColor || "000000",
            legendFontSize: visualData.options?.legendFontSize || 12,
            dataLabelColor: visualData.options?.dataLabelColor || "000000",
            dataLabelFontSize: visualData.options?.dataLabelFontSize || 14,
            showLeaderLines: visualData.options?.showLeaderLines ?? true,
            showTitle: visualData.options?.showTitle ?? false,
            shadow: visualData.options?.shadow,
          }
        );
        break;
      }

      case "bar": {
        if (!Array.isArray(visualData.data) || visualData.data.length === 0) {
          console.error("Bar chart requires a non-empty data array");
          return;
        }

        // Extract series names (all keys except the category key)
        const seriesNames = Object.keys(visualData.data[0]).filter(
          (k) => k !== visualData.x
        );

        const labels = visualData.data.map((d) => d[visualData.x]);
        // WIP : Labels Automatically create Array
        // Map each series to chart data format
        const chartData = seriesNames.map((name) => ({
          name,
          labels,
          values: visualData.data.map((d) => d[name]),
        }));

        console.log(chartData);

        // Build chart options with defaults and user overrides
        const chartOpts = {
          x: 1,
          y: 1.5,
          w: 8,
          h: 4,
          chartColors,
          barGrouping: "clustered",

          // dataLabelFormatCode: "#,##0",
          showCatAxisTitle: true,
          catAxisLabelColor: COLORS_ACCENT[1],
          catAxisTitleColor: COLORS_ACCENT[1],
          catAxisTitle: visualData.x,
          catAxisTitleFontSize: 14,
          //
          showValAxisTitle: true,
          valAxisLabelColor: COLORS_ACCENT[2],
          valAxisTitleColor: COLORS_ACCENT[2],
          valAxisTitle: visualData.y,
          valAxisTitleFontSize: 14,
          // ...visualData.options,
        };

        slide.addChart(pptx.ChartType.bar3d, chartData, chartOpts);
        break;
      }

      case "line": {
        if (!Array.isArray(visualData.data) || visualData.data.length === 0) {
          console.error("Line chart requires a non-empty data array");
          return;
        }

        // Extract categories from the 'x' key
        const categories = visualData.data.map((d) => d[visualData.x]);

        // Extract series names (all keys except the category key)
        const seriesNames = Object.keys(visualData.data[0]).filter(
          (k) => k !== visualData.x
        );

        // Map each series to chart data format
        const chartData = seriesNames.map((name) => ({
          name,
          labels: categories,
          values: visualData.data.map((d) => d[name]),
        }));

        // Build chart options with defaults and user overrides
        const chartOpts = {
          x: 1,
          y: 1.5,
          w: 8,
          h: 4,
          chartColors: visualData.options?.colors || [
            "#4ECDC4",
            "#45B7D1",
            "#FF6B6B",
          ],
          showLegend: visualData.options?.showLegend ?? true,
          legendPos: visualData.options?.legendPos || "r",
          lineSmooth: visualData.options?.lineSmooth ?? false,
          lineSize: visualData.options?.lineSize || 2,
          lineDataSymbolSize: visualData.options?.lineDataSymbolSize || 6,
          lineDataSymbol: visualData.options?.lineDataSymbol || "circle",
          shadow: visualData.options?.shadow,
          catAxisLabelPos: visualData.options?.catAxisLabelPos || "nextTo",
          catAxisLabelRotate: visualData.options?.catAxisLabelRotate || 0,
          catAxisLabelColor: visualData.options?.catAxisLabelColor || "000000",
          valAxisLabelColor: visualData.options?.valAxisLabelColor || "000000",
          valAxisMajorUnit: visualData.options?.valAxisMajorUnit,
          valAxisMinVal: visualData.options?.valAxisMinVal,
          valAxisMaxVal: visualData.options?.valAxisMaxVal,
          valAxisLabelFormatCode:
            visualData.options?.valAxisLabelFormatCode || "#,##0",
          showDataLabels: visualData.options?.showDataLabels ?? false,
          dataLabelFormatCode:
            visualData.options?.dataLabelFormatCode || "#,##0",
          dataLabelPosition: visualData.options?.dataLabelPosition || "inEnd",
          ...visualData.options, // Allow any additional options to override defaults
        };

        slide.addChart(pptx.ChartType.line, chartData, chartOpts);
        break;
      }

      case "table": {
        if (!Array.isArray(visualData.data) || visualData.data.length === 0) {
          console.error("Table requires a non-empty data array");
          return;
        }

        const headers = Object.keys(visualData.data[0]);
        const rows = visualData.data.map((row) => headers.map((h) => row[h]));

        slide.addTable([headers, ...rows], {
          x: 1,
          y: 1.5,
          w: 8,
          color: "404040",
          headerRowColor: "2F5496",
          autoPage: true,
          border: { type: "solid", color: "A9A9A9", pt: 1 },
        });
        break;
      }

      default:
        console.warn(`Unsupported visual type: ${visualData.type}`);
    }
  }

  // 4. Text Content Handler
  function addTextContent(slide, content) {
    slide.addText(
      content.map((text) => ({
        text,
        options: {
          bullet: true,
          indent: 0.5,
          fontSize: 18,
          margin: { top: 0.1 },
        },
      })),
      { x: 1, y: 1.5, w: 8, h: 4 }
    );
  }

  // Generate Presentation
  pptx.writeFile({ fileName: "Advanced-Research-Presentation.pptx" });
};

export default generatePresentation;
