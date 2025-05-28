// TABLE
export const tableConfig = {
  x: 1.0, // number | string - horizontal position (inches or %)
  y: 1.0, // number | string - vertical position (inches or %)
  w: 8, // number | string - width of the table (inches or %)
  h: 4, // number | string - height of the table (inches or %)
  colW: [2, 2, 2], // number[] - column widths
  rowH: [1, 1, 1], // number[] - row heights
  align: "center", // 'left' | 'center' | 'right' - horizontal text alignment
  valign: "middle", // 'top' | 'middle' | 'bottom' - vertical text alignment
  fontFace: "Arial", // string - font family
  fontSize: 12, // number - font size in points
  color: "000000", // string - font color (hex)
  margin: [5, 5, 5, 5], // number[] - cell margin in TRBL order
  border: {
    // object - table cell border config
    type: "solid", // 'none' | 'solid' | 'dash'
    pt: 1, // number - border thickness
    color: "000000", // string - hex color
  },
  autoPage: true, // boolean - enable auto-paging if table exceeds slide height
  autoPageRepeatHeader: true, // boolean - repeat headers on new slidesa
  autoPageHeaderRows: 1, // number - number of header rows to repeat
  data: [
    // (string | { text: string, options?: object })[][] - table content
    [
      { text: "Header 1", options: { bold: true, fill: "f2f2f2" } }, // object cell with formatting
      { text: "Header 2", options: { bold: true, fill: "f2f2f2" } },
      { text: "Header 3", options: { bold: true, fill: "f2f2f2" } },
    ],
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"], // simple string cells
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
  ],
};

// TEXT
export const myText = {
  text: "Hello, world!", // string - the actual text content
  options: {
    x: 1, // number | string - horizontal position (inches or percentage)
    y: 1, // number | string - vertical position (inches or percentage)
    w: "80%", // number | string - width (inches or percentage)
    h: 1, // number | string - height (inches or percentage)

    fontSize: 18, // number - font size in points
    bold: true, // boolean - whether the text is bold
    align: "center", // 'left' | 'center' | 'right' | 'justify' - text alignment
    color: "333333", // string - hex color for text

    underline: {
      style: "single", // 'none' | 'single' | 'double' - underline style
    },

    shadow: {
      type: "outer", // 'outer' | 'inner' - shadow placement
      color: "000000", // string - shadow color (hex)
      blur: 3, // number - shadow blur radius
      offset: 4, // number - shadow distance from text
      opacity: 0.6, // number (0 to 1) - shadow opacity
    },
  },
};

// SHAPES FOR FLOWCHARTS
// slide.addShape(pptx.ShapeType.rect, {
//   x: 1, y: 1, w: 4, h: 2,
//   fill: { color: "00B050" },
//   line: { color: "006600" },
//   text: "Rectangle",
//   fontSize: 18,
//   color: "FFFFFF",
//   align: "center",
//   valign: "middle"
// });

// slide.addShape(pptx.ShapeType.roundRect, {
//   x: 1, y: 4, w: 4, h: 2,
//   fill: { color: "4472C4" },
//   line: { color: "2F5597" },
//   rectRadius: 0.5,
//   text: "Rounded Rect",
//   fontSize: 18,
//   color: "FFFFFF",
//   align: "center",
//   valign: "middle"
// });

// slide.addShape(pptx.ShapeType.ellipse, {
//   x: 6, y: 1, w: 3, h: 3,
//   fill: { color: "FFC000" },
//   line: { color: "995500" },
//   text: "Ellipse",
//   fontSize: 18,
//   color: "000000",
//   align: "center",
//   valign: "middle"
// });

// slide.addShape(pptx.ShapeType.triangle, {
//   x: 6, y: 4, w: 3, h: 3,
//   fill: { color: "ED7D31" },
//   line: { color: "A65A0D" },
//   text: "Triangle",
//   fontSize: 18,
//   color: "000000",
//   align: "center",
//   valign: "middle"
// });

// MEDIA YOUTUBE
// slide.addMedia({
//   type: "online", // indicates an online video like YouTube
//   link: "https://www.youtube.com/embed/g36-noRtKR4", // YouTube embed URL (from Share > Embed)
//   x: 1,   // horizontal position in inches
//   y: 1,   // vertical position in inches
//   w: 8,   // width in inches
//   h: 4.5, // height in inches (16:9 aspect ratio)
// });

// IMAGE
// slide.addMedia({
//   type: "video",             // media type: "video" or "audio"
//   data: "video/mp4;base64,AAAAIGZ0eXBl...", // full base64 string with MIME prefix
//   x: 1,                      // horizontal position (inches)
//   y: 1,                      // vertical position (inches)
//   w: 6,                      // width (inches)
//   h: 4                       // height (inches)
// });

// CHART

// // Bar Chart (Category/Value) with legend and custom colors
// const dataBar = [
//   { Category: "Q1", Value: 1500 },
//   { Category: "Q2", Value: 2000 },
//   { Category: "Q3", Value: 1800 },
//   { Category: "Q4", Value: 2200 }
// ];
// slide.addChart(pptx.ChartType.bar, dataBar, {
//   x: 0.5, y: 0.5, w: 4, h: 3,
//   showLegend: true,
//   legendPos: "r",
//   chartColors: ["0088CC", "FFCC00"],
//   showTitle: true,
//   title: "Quarterly Sales"
// });

// // Line Chart (Category/Value) with legend and title
// const dataLine = [
//   { Category: "Jan", Value: 300 },
//   { Category: "Feb", Value: 450 },
//   { Category: "Mar", Value: 500 },
//   { Category: "Apr", Value: 600 }
// ];
// slide.addChart(pptx.ChartType.line, dataLine, {
//   x: 5, y: 0.5, w: 4, h: 3,
//   showLegend: true,
//   legendPos: "r",
//   showTitle: true,
//   title: "Monthly Revenue"
// });

// // Table (Category/Value)
// const tableData = [
//   ["Category", "Value"],
//   ["Q1", 1500],
//   ["Q2", 2000],
//   ["Q3", 1800],
//   ["Q4", 2200]
// ];
// slide.addTable(tableData, { x: 0.5, y: 4, w: 4, h: 2 });

// // Pie Chart (labels/values) with percentages and legend at bottom
// const dataPie = {
//   labels: ["Apples", "Bananas", "Cherries"],
//   values: [30, 50, 20]
// };
// slide.addChart(pptx.ChartType.pie, dataPie, {
//   x: 5, y: 4, w: 3, h: 3,
//   showPercent: true,
//   showLegend: true,
//   legendPos: "b",
//   showTitle: true,
//   title: "Fruit Distribution"
// });

// // Doughnut Chart (labels/values) with percentages and legend at bottom
// const dataDoughnut = {
//   labels: ["Red", "Blue", "Green"],
//   values: [40, 35, 25]
// };
// slide.addChart(pptx.ChartType.doughnut, dataDoughnut, {
//   x: 9, y: 4, w: 3, h: 3,
//   showPercent: true,
//   showLegend: true,
//   legendPos: "b",
//   showTitle: true,
//   title: "Color Breakdown"
// });

// // Save the presentation
// pptx.writeFile("ChartsWithConfigDemo.pptx");
