import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { analyzedData, selectedTemplate, imageTemplates } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const config = {
      responseMimeType: "text/plain",
    };

    const model = "gemini-1.5-flash";
    const prompt = `You are a professional presentation layout designer who outputs structured JSON configurations for pptxgenjs.

You DO NOT write code or UI components. You ONLY return clean, well-formatted JSON layouts based on extracted input data — with exact positioning, spacing, and styles using inches.

Follow the PPTXGENJS RULEBOOK strictly to generate effective layouts using proper spacing, text sizes, objects types, and design best practices. DO NOT rely on visual assumptions — all objects dimensions and placements must be precise and rule-based.

Your final output is a single valid JSON objects matching the EXAMPLE OUTPUT FORMAT below. No explanations or extra content — just JSON.

Input includes:
- selectedTemplate: slide layout and color metadata
- imagesTemplate: slide type to background image mapping
- extractedData: slide content and structure to convert

Apply flattening logic from the rulebook, convert all pixels to inches (1 inch = 96 px), and design clean, structured slides from extracted data. Layout is fully data-driven.

================ PPTXGENJS RULEBOOK ==================

1. 📐 Positioning & Units

Use inches for all measurements (1 in = 96 px)

Standard slide size: 10 in (width) × 5.625 in (height)

Common properties for all objects: "x", "y", "w", "h" (all in inches)

Include pixel equivalents as inline comments for clarity

2. 📝 Text (slide.addText)

Properties:
x, y, w, h, fontFace (e.g., "Arial"), fontSize (pt), color (hex), bold, italic, underline,
align ("left", "center", "right"), valign ("top", "middle", "bottom"), margin ([top, right, bottom, left] in pts),
shadow, bullet, hyperlink, rtlMode

Design Tips:
Headings: 18–32 pt, Body: 12–18 pt
Use consistent fontFace (e.g., Arial or Segoe UI)
Clear alignment and spacing
Bullets for lists; titles bold and larger for emphasis

3. 🔷 Shapes (slide.addShape)

Properties:
type ("rect", "roundRect", "ellipse", etc.), x, y, w, h, fill (color, transparency), line (color, pt),
rectRadius (0–1 for rounded corners), flipH, flipV, text (styled like addText)

Design Tips:
Use branded colors from template
Rounded corners (~0.1) for polish
Center-align text inside shapes when used as labels or stat boxes

4. 📊 Charts (slide.addChart)

Properties:
type ("bar", "pie", "line", "doughnut"), x, y, w, h,
data (series with name, labels, values), showLegend, legendPos, showPercent (for pies/doughnuts),
chartColors, showTitle, title

Design Tips:
Use clear legend positions (e.g., "b" for bottom)
Consistent color palettes
Enable showPercent for pie/doughnut charts for clarity

5. 📋 Tables (slide.addTable)

Properties:
x, y, w, h, colW (array), rowH (array), fontFace, fontSize, color, align, valign,
margin, border (type, color, pt), autoPage, autoPageRepeatHeader

Design Tips:
Bold headers with background fill
Use autoPage for long tables
Maintain consistent row/column sizes for clean alignment

6. 🎨 Background (slide.background)

Properties:
color (hex), data (base64 image)

Design Tips:
Use light or subtle colors
Match background images by slide type
Prefer base64 for portability

7. 🎥 Media (slide.addMedia)

Properties:
type ("image", "video", "online"), path/link/data, x, y, w, h, cover (thumbnail)

Design Tips:
Maintain aspect ratio
Use cover for full fit without distortion

8. 🧠 Design Best Practices

Use consistent grids, margins (1 in), gutters (0.5 in)

Font hierarchy: title > subtitle > body

Minimal branded color palette

Allow whitespace for readability

Use inches and "%" units for responsive layouts

Include pixel-to-inch comments for clarity

9. 🧱 Objects Mapping

Every content objects must include:

"type": one of "text", "shape", "chart", "table", or "media"

"config": detailed properties as described above

10. 🧩 Content Flattening Logic

String → single heading text objects

Array of strings → bullet list text objects

{title, content} → two objects: heading + body

Stack vertically with incremental y positions

Use default heights: heading ~0.6 in, body ~1.0 in

Default margin: [5, 5, 5, 5]

11. 🖼️ Background Image Matching

Match slide "type" with imagesTemplate.title to assign "slideImage" URL

================ END OF RULEBOOK ==================

🎯 TASK  

You’ll receive:
- "selectedTemplate": layout/colors metadata  
- "imagesTemplate": mapping of slide types → background images  
- "extractedData": analyzed document data with slides

📌 Your responsibilities:
1. **Slide Type Matching**:  
   - Match slide.type to imagesTemplate.title for background selection  
   - Prioritize exact matches (case-insensitive)

2. **Content Analysis & Flattening**:  
   Analyze each slide’s **categorizedOutput** and **title** along with its **categorizedType** to determine the appropriate pptxgenjs objects types and layouts.

   === CONTENT MAPPING RULES ===  
   | Slide Title            | categorizedType               | pptxgenjs Objects Strategy               | Notes                                |
   |------------------------|------------------------------|----------------------------------------|-------------------------------------|
   | Title Slide            | string                       | Single centered title text (36-44pt)   | Large heading                       |
   | Agenda                 | string[]                     | Bulleted list with 24pt spacing        | Simple bullet points                |
   | Topic Sections         | {title,content}[]            | Section headers + body text columns    | Stacked title + content             |
   | Detailed Charts        | {name:string, labels:string[], values:number[]}[] | Full-width bar/pie/doughnut charts | Use name, labels, values for charts |
   | Comparison             | {contentA:string[], contentB:string[]} | Two-column table or side-by-side text  | Color-coded columns possible        |
   | Metrics                | {label:string, content:string}[] | Icon grid with label-value pairs       | Grid layout with text               |
   | Quiz/Recap             | {question:string, choices:string[], answer:string}[] | Interactive-style boxes with indents | Use question and choices formatting |
   | Timeline               | {title:string, content:string}[] | Vertical line shape with dated milestones | Timeline visualization             |
   | Do's & Don'ts          | {contentA:string[], contentB:string[]} | Green/red colored columns              | Visual contrast                     |
   | Case Study             | {title:string, content:string}[] | Before/after image grids               | Paired content sections             |

3. **Design Enforcement**:  
   - Use 12-column grid (0.5" gutter) for layout  
   - Font hierarchy:  
     - Titles: 28-36pt  
     - Subtitles: 22-24pt  
     - Body: 16-18pt  
   - Color scheme from selectedTemplate  
   - Auto-space objects vertically (min 0.3" between elements)

4. **Pixel-Perfect Conversion**:  
   - 1" = 96px → convert px to inches accordingly  
   - Include pixel comments for key measurements

---

📤 EXAMPLE OUTPUT FORMAT (Strict JSON) WITH COMMENT THAT SHOULD NOT BE INCLUDED IN ACTUAL OUTPUT:

{
  "template": "// this template shows what type of template chosen",
  "slides": [
    {
      "type": "// title of the slide",
      "slideImage": "// image from imageTemplate",
      "objects": [
        {
          "type": "text",
          "config": {
            "text": "// title of the objects type text",
            "x": 1.5, 
            "y": 2.0,
            "w": 7.0,
            "h": 1.5,
            "fontSize": 36,
            "bold": true,
            "align": "center"
          }
        }
      ]
    },
    {
      "type": "Detailed Charts",
      "slideImage": "https://example.com/chart-bg.jpg",
      "objects": [
        {
          "type": "chart",
          "config": {
            "chartType": "doughnut",
            "x": 0.5,
            "y": 1.0,
            "w": 4.0,
            "h": 3.0,
            "data": {
              "series": [
                { "name": "Sales", "labels": ["Q1", "Q2", "Q3"], "values": [45, 32, 67] }
              ]
            },
            "chartColors": ["#2F5496", "#5B9BD5", "#A9CCE3"],
            "showLegend": true
          }
        },
        {
          "type": "chart",
          "config": {
            "chartType": "pie",
            "x": 5.0,
            "y": 1.0,
            "w": 4.0,
            "h": 3.0,
            "data": {
              "series": [
                { "name": "Market Share", "labels": ["Product A", "Product B", "Product C"], "values": [40, 35, 25] }
              ]
            },
            "showPercent": true,
            "chartColors": ["#4472C4", "#ED7D31", "#A5A5A5"],
            "showLegend": true
          }
        },
        {
          "type": "chart",
          "config": {
            "chartType": "bar",
            "x": 0.5,
            "y": 4.5,
            "w": 4.0,
            "h": 3.0,
            "data": {
              "series": [
                { "name": "2023", "labels": ["Q1", "Q2", "Q3"], "values": [45, 32, 67] },
                { "name": "2024", "labels": ["Q1", "Q2", "Q3"], "values": [55, 40, 75] }
              ]
            },
            "chartColors": ["#2F5496", "#5B9BD5"],
            "showLegend": true,
            "legendPos": "r"
          }
        },
        {
          "type": "chart",
          "config": {
            "chartType": "line",
            "x": 5.0,
            "y": 4.5,
            "w": 4.0,
            "h": 3.0,
            "data": {
              "series": [
                { "name": "Visitors", "labels": ["Jan", "Feb", "Mar"], "values": [1500, 4600, 5156] }
              ]
            },
            "chartColors": ["#70AD47"],
            "showLegend": true,
            "legendPos": "r",
            "smooth": true
          }
        },
        {
          "type": "table",
          "config": {
            "x": 0.5,
            "y": 8.0,
            "w": 9.0,
            "colW": [3.0, 3.0, 3.0],
            "fontSize": 16,
            "border": { "pt": 1, "color": "DDDDDD" },
            "data": [
              [
                { "text": "Metric", "options": { "bold": true, "fill": "F2F2F2" } },
                { "text": "2023", "options": { "bold": true, "fill": "F2F2F2" } },
                { "text": "2024", "options": { "bold": true, "fill": "F2F2F2" } }
              ],
              ["Revenue", "$1.2M", "$1.5M"],
              ["Profit", "$300K", "$450K"]
            ]
          }
        }
      ]
    }
  ]
}

---

### INPUT PARAMETERS (to be injected dynamically)

You will receive the following variables to generate the presentation slides:

- **selectedTemplate**:  
${JSON.stringify(selectedTemplate)}

- **imagesTemplate**:  
${JSON.stringify(imageTemplates)}

- **extractedData**:  
${JSON.stringify(analyzedData)}

---

### AI TASK SUMMARY

- Use **selectedTemplate** for template metadata, slide layouts, and default backgrounds/colors.  
- Use **imagesTemplate** to find and assign the correct background image URL for each slide by matching slide "type".  
- Use **extractedData** to flatten and map slide content into pptxgenjs content objects with "type", "title", and "config" properties.  
- Convert all pixel measurements to inches (px ÷ 96) and include pixel equivalents as comments in configs.  
- Output the final JSON with template info, slides (each with "slideImage"), and content objects.

    `;

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = "";

    for await (const chunk of response) {
      const part = chunk.candidates?.[0]?.content?.parts?.[0];
      if (typeof part === "string") {
        fullResponse += part;
      } else if (part?.text) {
        fullResponse += part.text;
      }
    }

    fullResponse = fullResponse.replace(/```json|```/g, "").trim();
    // Now parse the complete string
    console.log("🟢 fullResponse");
    console.log(fullResponse);
    const parsedSlides = JSON.parse(fullResponse);

    return NextResponse.json({ result: parsedSlides }, { status: 200 });
  } catch (err: any) {
    console.error("Error:", err.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// oldPrompt = `
// You are a professional presentation layout designer who outputs structured JSON configuration objects for pptxgenjs.

// You DO NOT write code or visual components. You ONLY return clean, well-formatted JSON layouts based on extracted input data — with exact positioning, spacing, and styles using inches.

// Follow the PPTXGENJS RULEBOOK strictly to generate effective layouts using proper spacing, text sizes, object types, and design best practices. DO NOT rely on visual assumptions — all object dimensions and placements must be precise and rule-based.

// You must follow the EXAMPLE OUTPUT FORMAT provided below. Your final output is a single valid JSON object. No explanations, no markdown, no extra content — just the JSON.

// Your input includes:
// - selectedTemplate: slide layout/colors metadata
// - imagesTemplate: slide type → background image mapping
// - extractedData: slide content and structure to convert

// Apply flattening logic from the rulebook, convert all pixels to inches, and design clean, structured slides from the extracted data. No visual provision is needed — layout is fully data-driven.

// ================ PPTXGENJS RULEBOOK ==================

// 📐 1. Positioning & Units
// - Use inches for all measurements (1 in = 96px)
// - Common slide size: 10 in (width) × 5.625 in (height)
// - Object Props: "x", "y", "w", "h"

// 📝 2. Text (slide.addText)
// Props:
// - "x", "y", "w", "h" (in inches)
// - "fontFace" (e.g., "Arial"), "fontSize", "color", "bold", "italic", "underline"
// - "align" ("left", "center", "right"), "valign" ("top", "middle", "bottom")
// - "margin" (array of four: [top, right, bottom, left] in pts)
// - "shadow", "bullet", "hyperlink", "rtlMode"

// Tips:
// - Headings: **18–32pt**, Body: **12–18pt**
// - Use **consistent fontFace** (e.g., "Arial" or "Segoe UI")
// - Prefer clear alignment, spacing, and subtle shadows for contrast
// - Bullets for lists; titles should stand out with larger size & bold

// 🔷 3. Shapes (slide.addShape)
// Props:
// - "type" (e.g., "rect", "roundRect"), "x", "y", "w", "h", "fill", "line"
// - "rectRadius" (for rounded corners), "flipH", "flipV", "text"

// Tips:
// - Use **branded colors** from template
// - Rounded corners improve polish ("rectRadius: 0.1")
// - Center text inside shape when used as label or stat box

// 📊 4. Charts (slide.addChart)
// Props:
// - "type" ("bar", "pie", "line"), "x", "y", "w", "h"
// - "data", "showLegend", "legendPos", "showPercent", "chartColors"
// - "showTitle", "title"

// Tips:
// - Use clear legend positions (e.g., "b" for bottom)
// - Prefer consistent color palette ("chartColors")
// - For pie charts, always enable "showPercent": true

// 📋 5. Tables (slide.addTable)
// Props:
// - "x", "y", "w", "h"
// - "colW" (array of col widths), "rowH" (array of row heights)
// - "fontFace", "fontSize", "color", "align", "valign"
// - "border" (e.g., "{ type: "solid", color: "000000", pt: 1 }")
// - "autoPage", "autoPageRepeatHeader"

// Tips:
// - Use styled headers (e.g., bold, background fill)
// - Enable "autoPage": true // for long data
// - Maintain row/col width ratios for clean alignment

// 🎨 6. Background (slide.background)
// Props:
// - "color" (hex like "#FFFFFF"), or "data" (base64 image)

// Tips:
// - Prefer light or subtle colors for background
// - If using image, match "type" with "imagesTemplate"
// - Use "base64" for seamless background delivery

// 🎥 7. Media (slide.addMedia)
// Props:
// - "type" ("image", "video", etc.), "path" or "data" or "link"
// - "x", "y", "w", "h", "cover"

// Tips:
// - Maintain **aspect ratio**
// - Use "cover": true // to ensure full-fit without distortion

// 🧠 8. Design Best Practices
// - Use consistent **grids**, **margins**, and **spacing**
// - Font hierarchy: title > subtitle > content
// - Color palette should be minimal and branded
// - Allow **whitespace** for readability
// - Always use inches, and favor **"%"** when creating responsive layouts
// - Use comments for px → in conversion if needed for clarity

// 🧱 9. Object Mapping
// Every content object must include:
// - "type": "text", "shape", "chart", "table", or "media"
// - "config": object with detailed props

// 🧩 10. Content Flattening Logic
// - String → one heading text box
// - Array of strings → bullet list
// - "{ title, content }" → two objects: one heading and one body
// - Increment "y" to stack multiple objects cleanly
// - Use "h": 0.6 // for heading, "h": 1.0 // for body text
// - Use "margin": [5,5,5,5] // (pts) by default

// 🖼️ 11. Background Image Matching
// - Match "type" with "imagesTemplate" to get "slideImage"
// - Ensure proper positioning and non-intrusive visuals

// 📊 12. Summary of Key Object Props
// | Object | Key Props                             | Units     |
// |--------|----------------------------------------|-----------|
// | Text   | x, y, w, h, fontFace, fontSize, etc.   | in, pt    |
// | Shape  | x, y, w, h, fill, text, rectRadius     | in        |
// | Chart  | x, y, w, h, title, colors, legend      | in        |
// | Table  | x, y, w, h, colW, rowH, border         | in        |
// | Media  | x, y, w, h, path/link/data             | in        |
// | BG     | color, data (base64 image)             | hex/base64|

// ==================================================== END OF RULEBOOK =================================================

// 🎯 TASK

// You’ll receive:
// - "selectedTemplate": layout/colors metadata
// - "imagesTemplate": mapping of slide types → background images
// - "extractedData": analyzed document data with slides

// 📌 Your responsibilities:
// 1. **Slide Type Matching**:
//    - Match slide.type to imagesTemplate.title for background selection
//    - Prioritize exact matches (case-insensitive)

// 2. **Content Analysis & Flattening**:
//    Analyze each slide’s **categorizedOutput** and **title** along with its **categorizedType** to determine the appropriate pptxgenjs object types and layouts.

//    === CONTENT MAPPING RULES ===
//    | Slide Title            | categorizedType               | pptxgenjs Object Strategy               | Notes                                |
//    |------------------------|------------------------------|----------------------------------------|-------------------------------------|
//    | Title Slide            | string                       | Single centered title text (36-44pt)   | Large heading                       |
//    | Agenda                 | string[]                     | Bulleted list with 24pt spacing        | Simple bullet points                |
//    | Topic Sections         | {title,content}[]            | Section headers + body text columns    | Stacked title + content             |
//    | Detailed Charts        | {name:string, labels:string[], values:number[]}[] | Full-width bar/pie/doughnut charts | Use name, labels, values for charts |
//    | Comparison             | {contentA:string[], contentB:string[]} | Two-column table or side-by-side text  | Color-coded columns possible        |
//    | Metrics                | {label:string, content:string}[] | Icon grid with label-value pairs       | Grid layout with text               |
//    | Quiz/Recap             | {question:string, choices:string[], answer:string}[] | Interactive-style boxes with indents | Use question and choices formatting |
//    | Timeline               | {title:string, content:string}[] | Vertical line shape with dated milestones | Timeline visualization             |
//    | Do's & Don'ts          | {contentA:string[], contentB:string[]} | Green/red colored columns              | Visual contrast                     |
//    | Case Study             | {title:string, content:string}[] | Before/after image grids               | Paired content sections             |

// 3. **Design Enforcement**:
//    - Use 12-column grid (0.5" gutter) for layout
//    - Font hierarchy:
//      - Titles: 28-36pt
//      - Subtitles: 22-24pt
//      - Body: 16-18pt
//    - Color scheme from selectedTemplate
//    - Auto-space objects vertically (min 0.3" between elements)

// 4. **Pixel-Perfect Conversion**:
//    - 1" = 96px → convert px to inches accordingly
//    - Include pixel comments for key measurements

// ---

// 📤 OUTPUT FORMAT (Strict JSON):

// {
//   "template": "modern-light",
//   "slides": [
//     {
//       "type": "Title Slide",
//       "slideImage": "https://example.com/bg-title.png",
//       "object": [
//         {
//           "type": "text",
//           "config": {
//             "text": "AI-Powered Analytics",
//             "x": 1.5,          // 144px
//             "y": 2.0,          // 192px
//             "w": 7.0,          // 672px
//             "h": 1.5,          // 144px
//             "fontSize": 36,
//             "bold": true,
//             "align": "center"
//           }
//         }
//       ]
//     },
//     {
//       "type": "Detailed Charts",
//       "slideImage": "https://example.com/chart-bg.jpg",
//       "object": [
//         {
//           "type": "chart",
//           "config": {
//             "chartType": "doughnut",
//             "x": 0.5,          // 48px
//             "y": 1.0,          // 96px
//             "w": 4.0,          // 384px
//             "h": 3.0,          // 288px
//             "data": {
//               "series": [
//                 { "name": "Sales", "labels": ["Q1", "Q2", "Q3"], "values": [45, 32, 67] }
//               ]
//             },
//             "chartColors": ["#2F5496", "#5B9BD5", "#A9CCE3"],
//             "showLegend": true
//           }
//         },
//         {
//           "type": "chart",
//           "config": {
//             "chartType": "pie",
//             "x": 5.0,          // 480px
//             "y": 1.0,          // 96px
//             "w": 4.0,          // 384px
//             "h": 3.0,          // 288px
//             "data": {
//               "series": [
//                 { "name": "Market Share", "labels": ["Product A", "Product B", "Product C"], "values": [40, 35, 25] }
//               ]
//             },
//             "showPercent": true,
//             "chartColors": ["#4472C4", "#ED7D31", "#A5A5A5"],
//             "showLegend": true
//           }
//         },
//         {
//           "type": "chart",
//           "config": {
//             "chartType": "bar",
//             "x": 0.5,          // 48px
//             "y": 4.5,          // 432px
//             "w": 4.0,          // 384px
//             "h": 3.0,          // 288px
//             "data": {
//               "series": [
//                 { "name": "2023", "labels": ["Q1", "Q2", "Q3"], "values": [45, 32, 67] },
//                 { "name": "2024", "labels": ["Q1", "Q2", "Q3"], "values": [55, 40, 75] }
//               ]
//             },
//             "chartColors": ["#2F5496", "#5B9BD5"],
//             "showLegend": true,
//             "legendPos": "r"
//           }
//         },
//         {
//           "type": "chart",
//           "config": {
//             "chartType": "line",
//             "x": 5.0,          // 480px
//             "y": 4.5,          // 432px
//             "w": 4.0,          // 384px
//             "h": 3.0,          // 288px
//             "data": {
//               "series": [
//                 { "name": "Visitors", "labels": ["Jan", "Feb", "Mar"], "values": [1500, 4600, 5156] }
//               ]
//             },
//             "chartColors": ["#70AD47"],
//             "showLegend": true,
//             "legendPos": "r",
//             "smooth": true
//           }
//         },
//         {
//           "type": "table",
//           "config": {
//             "x": 0.5,          // 48px
//             "y": 8.0,          // 768px
//             "w": 9.0,          // 864px
//             "colW": [3.0, 3.0, 3.0], // 288px each
//             "fontSize": 16,
//             "border": { "pt": 1, "color": "DDDDDD" },
//             "data": [
//               [
//                 { "text": "Metric", "options": { "bold": true, "fill": "F2F2F2" } },
//                 { "text": "2023", "options": { "bold": true, "fill": "F2F2F2" } },
//                 { "text": "2024", "options": { "bold": true, "fill": "F2F2F2" } }
//               ],
//               ["Revenue", "$1.2M", "$1.5M"],
//               ["Profit", "$300K", "$450K"]
//             ]
//           }
//         }
//       ]
//     }
//   ]
// }

//     ### INPUT PARAMETERS (to be injected dynamically)

//     You will receive the following variables to generate the presentation slides:

//     - **selectedTemplate**:
//     ${JSON.stringify(selectedTemplate)}

//     - **imagesTemplate**:
//     ${JSON.stringify(imageTemplates)}

//     - **extractedData**:
//     ${JSON.stringify(analyzedData)}

//     ---

//     ### AI TASK SUMMARY

//     - Use **selectedTemplate** for template metadata, slide layouts, and default backgrounds/colors.
//     - Use **imagesTemplate** to find and assign the correct background image URL for each slide by matching slide "type".
//     - Use **extractedData** to flatten and map slide content into pptxgenjs content objects with "type", "title", and "config" properties.
//     - Convert all pixel measurements to inches (px ÷ 96) and include pixel equivalents as comments in configs.
//     - Output the final JSON with template info, slides (each with "slideImage"), and content objects.

// `

// object result from presentation
// {
//     "template": "Informative",
//     "slides": [
//         {
//             "type": "Title Slide",
//             "slideImage": "https://example.com/templates/modern-light/bg-title.png",
//             "objects": [
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Impacts of the COVID-19 Pandemic on Doctoral Students' Thesis/Dissertation Progress",
//                         "x": 1.5,
//                         "y": 2,
//                         "w": 7,
//                         "h": 1.5,
//                         "fontSize": 44,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "center",
//                         "valign": "middle",
//                         "color": "#2F5496"
//                     }
//                 }
//             ]
//         },
//         {
//             "type": "Agenda",
//             "slideImage": "https://example.com/templates/modern-light/bg-content.png",
//             "objects": [
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Agenda",
//                         "x": 0.5,
//                         "y": 0.5,
//                         "w": 9,
//                         "h": 0.6,
//                         "fontSize": 24,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": [
//                             "Introduction and Research Question",
//                             "Literature Review: Doctoral Education, Pandemics, and COVID-19's Impact",
//                             "Methodology: Participants, Data Collection, and Analysis",
//                             "Findings: Five Major Impact Categories",
//                             "Discussion: Relationships with Supervisors, Stress and Workload, Institutional Contingency Plans, Complicating the Notion of Progress",
//                             "Limitations and Future Research",
//                             "Conclusion and Implications"
//                         ],
//                         "x": 0.5,
//                         "y": 1.1,
//                         "w": 9,
//                         "h": 4,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left",
//                         "bullet": true,
//                         "lineHeight": 1.5
//                     }
//                 }
//             ]
//         },
//         {
//             "type": "Key Facts",
//             "slideImage": "https://example.com/templates/modern-light/bg-content.png",
//             "objects": [
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Key Facts",
//                         "x": 0.5,
//                         "y": 0.5,
//                         "w": 9,
//                         "h": 0.6,
//                         "fontSize": 24,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": [
//                             "235 doctoral students from around the world participated in the study.",
//                             "The study identified five major categories of impact: research design, access to resources, workload, mental health, and finances.",
//                             "Most participants (87.2%) identified as female, and most (70.6%) identified as white.",
//                             "The majority of participants (66.8%) were enrolled in doctoral programs in the United States.",
//                             "Significant challenges included data collection disruptions, access limitations, increased workload, mental health issues, and financial difficulties.",
//                             "Some participants also reported benefits, such as increased access to online resources and more time for self-reflection."
//                         ],
//                         "x": 0.5,
//                         "y": 1.1,
//                         "w": 9,
//                         "h": 4,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left",
//                         "bullet": true,
//                         "lineHeight": 1.5
//                     }
//                 }
//             ]
//         },
//         {
//             "type": "Topic Sections",
//             "slideImage": "https://example.com/templates/modern-light/bg-content.png",
//             "objects": [
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Topic Sections",
//                         "x": 0.5,
//                         "y": 0.5,
//                         "w": 9,
//                         "h": 0.6,
//                         "fontSize": 24,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Introduction",
//                         "x": 0.5,
//                         "y": 1.1,
//                         "w": 4,
//                         "h": 0.6,
//                         "fontSize": 22,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "This study documented the impacts of the COVID-19 pandemic on doctoral students' progress on their culminating projects.  The research question explored how the pandemic impacted their progress.",
//                         "x": 0.5,
//                         "y": 1.7,
//                         "w": 4,
//                         "h": 1,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Literature Review",
//                         "x": 4.5,
//                         "y": 1.1,
//                         "w": 4.5,
//                         "h": 0.6,
//                         "fontSize": 22,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "The literature review examined doctoral education challenges, the impact of past pandemics on higher learning, and existing literature on COVID-19's effects on doctoral students.  Key themes included rising tuition costs, fewer academic job prospects, and the challenges faced by doctoral students in completing their degrees.",
//                         "x": 4.5,
//                         "y": 1.7,
//                         "w": 4.5,
//                         "h": 1,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Methodology",
//                         "x": 0.5,
//                         "y": 2.7,
//                         "w": 4,
//                         "h": 0.6,
//                         "fontSize": 22,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "An online questionnaire was administered to 235 doctoral students.  Data analysis involved In Vivo Coding to identify categories of experience and themes related to the pandemic's impact.",
//                         "x": 0.5,
//                         "y": 3.3,
//                         "w": 4,
//                         "h": 1,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Discussion",
//                         "x": 4.5,
//                         "y": 2.7,
//                         "w": 4.5,
//                         "h": 0.6,
//                         "fontSize": 22,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "The discussion analyzes the findings, highlighting themes such as the impact on student-supervisor relationships, the exacerbation of existing stress and workload issues, inadequacies in institutional contingency planning, and a reevaluation of the concept of progress in doctoral studies.",
//                         "x": 4.5,
//                         "y": 3.3,
//                         "w": 4.5,
//                         "h": 1,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Conclusion",
//                         "x": 0.5,
//                         "y": 4.3,
//                         "w": 4,
//                         "h": 0.6,
//                         "fontSize": 22,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "The conclusion summarizes the study's key findings, emphasizing the need for improved institutional support and contingency planning for doctoral students, and questioning the prevailing emphasis on speed in doctoral education.",
//                         "x": 0.5,
//                         "y": 4.9,
//                         "w": 4,
//                         "h": 1,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left"
//                     }
//                 }
//             ]
//         },
//         {
//             "type": "Infographic",
//             "slideImage": "https://example.com/templates/modern-light/bg-chart.png",
//             "objects": [
//                 {
//                     "type": "chart",
//                     "config": {
//                         "type": "bar",
//                         "x": 1,
//                         "y": 1,
//                         "w": 8,
//                         "h": 4,
//                         "data": {
//                             "series": [
//                                 {
//                                     "name": "Impact Categories",
//                                     "labels": [
//                                         "Research Design",
//                                         "Access to Resources",
//                                         "Workload",
//                                         "Mental Health",
//                                         "Finances"
//                                     ],
//                                     "values": [
//                                         76,
//                                         70,
//                                         69,
//                                         69,
//                                         77
//                                     ]
//                                 }
//                             ]
//                         },
//                         "chartColors": [
//                             "#2F5496",
//                             "#5B9BD5",
//                             "#A9CCE3",
//                             "#70AD47",
//                             "#ED7D31"
//                         ],
//                         "showLegend": true,
//                         "legendPos": "b"
//                     }
//                 }
//             ]
//         },
//         {
//             "type": "Timeline",
//             "slideImage": "https://example.com/templates/modern-light/bg-content.png",
//             "objects": [
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Timeline",
//                         "x": 0.5,
//                         "y": 0.5,
//                         "w": 9,
//                         "h": 0.6,
//                         "fontSize": 24,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Study Timeline",
//                         "x": 0.5,
//                         "y": 1.1,
//                         "w": 9,
//                         "h": 0.6,
//                         "fontSize": 22,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "April 2021: Received; June 2021: Revised; July 2021: Accepted; August-September 2020: Data Collection",
//                         "x": 0.5,
//                         "y": 1.7,
//                         "w": 9,
//                         "h": 3,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left"
//                     }
//                 }
//             ]
//         },
//         {
//             "type": "Summary",
//             "slideImage": "https://example.com/templates/modern-light/bg-summary.png",
//             "objects": [
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Summary",
//                         "x": 0.5,
//                         "y": 0.5,
//                         "w": 9,
//                         "h": 0.6,
//                         "fontSize": 24,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": [
//                             "The COVID-19 pandemic significantly impacted doctoral students' thesis/dissertation progress.",
//                             "Five major categories of impact were identified: research design, access to resources, workload, mental health, and finances.",
//                             "Institutions need to improve contingency plans to support doctoral students during crises.",
//                             "The study highlights the need for a re-evaluation of doctoral program priorities and structures.",
//                             "Further research is needed to explore individual experiences and coping strategies."
//                         ],
//                         "x": 0.5,
//                         "y": 1.1,
//                         "w": 9,
//                         "h": 4,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left",
//                         "bullet": true,
//                         "lineHeight": 1.5
//                     }
//                 }
//             ]
//         },
//         {
//             "type": "Q&A",
//             "slideImage": "https://example.com/templates/modern-light/bg-content.png",
//             "objects": [
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Questions and Discussion",
//                         "x": 0.5,
//                         "y": 0.5,
//                         "w": 9,
//                         "h": 0.6,
//                         "fontSize": 24,
//                         "fontFace": "Arial",
//                         "bold": true,
//                         "align": "left"
//                     }
//                 },
//                 {
//                     "type": "text",
//                     "config": {
//                         "text": "Open forum for questions and discussion on the study's findings and implications for doctoral education.",
//                         "x": 0.5,
//                         "y": 1.1,
//                         "w": 9,
//                         "h": 4,
//                         "fontSize": 18,
//                         "fontFace": "Arial",
//                         "align": "left"
//                     }
//                 }
//             ]
//         }
//     ]
// }
