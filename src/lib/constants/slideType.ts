import { TemplateType } from "../types";

export const presentationTemplates: TemplateType = {
  informative: {
    type: "Informative",
    description:
      "Best for delivering facts, updates, and structured information clearly and logically.",
    slides: [
      {
        title: "Title Slide",
        description: "Introduce the topic and speaker.",
        categorizedOutput: "string",
      },
      {
        title: "Agenda",
        description: "Outline what the audience will learn or see.",
        categorizedOutput: "string[]",
      },
      {
        title: "Key Facts",
        description: "Present essential data or findings.",
        categorizedOutput: "string[]",
      },
      {
        title: "Topic Sections",
        description: "Break content into digestible parts.",
        categorizedOutput: "{title: string, content: string}[]",
      },
      {
        title: "Infographic",
        description: "Use visuals to summarize complex data.",
        categorizedOutput:
          "{ name: string; labels: string[]; values: number[] }[]",
      },
      {
        title: "Timeline",
        description: "Show chronological events or progress.",
        categorizedOutput: "{ title: string, content: string }[]",
      },
      {
        title: "Summary",
        description: "Recap all key takeaways.",
        categorizedOutput: "string[]",
      },
      {
        title: "Q&A",
        description: "Invite audience questions or discussion.",
        categorizedOutput: "{ title: string, content: string }[]",
      },
    ],
  },
  instructional: {
    type: "Instructional",
    description:
      "Ideal for tutorials, walkthroughs, and step-by-step content that teaches or explains.",
    slides: [
      {
        title: "Title & Objective",
        description: "State the learning goal clearly.",
        categorizedOutput: "{ title: string, content: string }",
      },
      {
        title: "Step-by-Step Guide",
        description: "Walk through the process sequentially.",
        categorizedOutput: "{ title: string, content: string }[]",
      },
      {
        title: "Diagram or Flowchart",
        description: "Visualize how the process works.",
        categorizedOutput: "{title: string, content: string}[]", //flowchart
      },
      {
        title: "Do's & Don'ts",
        description: "Show best practices vs mistakes.",
        categorizedOutput: "{ contentA: string[], contentB: string[] }",
      },
      {
        title: "Checklist",
        description: "Tasks or items to complete.",
        categorizedOutput: "string[]",
      },
      {
        title: "Live Example",
        description: "Show a practical demonstration.",
        categorizedOutput: "string",
      },
      {
        title: "Quiz / Recap",
        description: "Check understanding with a quick review.",
        categorizedOutput:
          "{ question: string; choices: string[]; answer: string }[]", //quiz
      },
      {
        title: "Resources",
        description: "Link to additional materials or references.",
        categorizedOutput: "{ title: string; content: string }[]",
      },
    ],
  },
  inspiring: {
    type: "Inspiring",
    description:
      "Used to engage emotions, share stories, or motivate an audience with powerful visuals and messages.",
    slides: [
      {
        title: "Opening Quote",
        description: "Start with a powerful, emotional quote.",
        categorizedOutput: "string",
      },
      {
        title: "Storytelling",
        description: "Share a personal or relatable story.",
        categorizedOutput: "string",
      },
      {
        title: "Problem / Struggle",
        description: "Set up the challenge or conflict.",
        categorizedOutput: "string",
      },
      {
        title: "Visual Impact",
        description: "Use full-screen images with minimal text.",
        categorizedOutput: "string",
      },
      {
        title: "Vision / Future",
        description: `Paint a picture of what’s possible.`,
        categorizedOutput: "string",
      },
      {
        title: "Core Values",
        description: "Highlight beliefs and guiding principles.",
        categorizedOutput: "string[]",
      },
      {
        title: "Call to Action",
        description: "Encourage the audience to act or reflect.",
        categorizedOutput: "string",
      },
      {
        title: "Thank You / Reflection",
        description: "End with gratitude or a thought-provoking message.",
        categorizedOutput: "string",
      },
    ],
  },
  convincing: {
    type: "Convincing",
    description:
      "Effective for presenting arguments, pitching ideas, or persuading stakeholders to take action.",
    slides: [
      {
        title: "Opening Hook",
        description: "Ask a bold question or state a bold claim.",
        categorizedOutput: "string",
      },
      {
        title: "Problem Slide",
        description: "Present the issue clearly.",
        categorizedOutput: "string",
      },
      {
        title: "Solution Slide",
        description: "Show your idea or product as the answer.",
        categorizedOutput: "string",
      },
      {
        title: "Benefits",
        description: "Explain why it works better than alternatives.",
        categorizedOutput: "string[]",
      },
      {
        title: "Comparison",
        description: "Highlight differences vs other options.",
        categorizedOutput: "{ contentA: string[], contentB: string[] }",
      },
      {
        title: "Case Study / Proof",
        description: "Show results from real-world examples.",
        categorizedOutput: "{ title: string, content: string }[]",
      },
      {
        title: "Call to Action",
        description: "Tell the audience exactly what to do next.",
        categorizedOutput: "string",
      },
      {
        title: "Objection Handling",
        description: "Address concerns before they're raised.",
        categorizedOutput: "{ title: string; content: string }[]",
      },
    ],
  },
  analytical: {
    type: "Analytical",
    description:
      "Great for showing data, comparing options, and helping audiences make decisions based on insights.",
    slides: [
      {
        title: "Problem Statement",
        description: "Frame the issue or question.",
        categorizedOutput: "string",
      },
      {
        title: "Data Overview",
        description: "Summarize the dataset or sources.",
        categorizedOutput: "string",
      },
      {
        title: "Detailed Charts",
        description: "Visualize key data findings.",
        categorizedOutput:
          "{ name: string; labels: string[]; values: number[] }[]",
      },
      {
        title: "Comparison",
        description: "Highlight contrasts or patterns.",
        categorizedOutput:
          "{ label: string, valueA: number; valueB: number }[]", //comparison or diagram to compare
      },
      {
        title: "Metrics",
        description: "Show KPIs or performance measures.",
        categorizedOutput: "{ label: string, content: string }[]", //metrics
      },
      {
        title: "Insights",
        description: "Explain what the data reveals.",
        categorizedOutput: "string[]",
      },
      {
        title: "Recommendations",
        description: "Offer data-backed suggestions.",
        categorizedOutput: "string[]",
      },
      {
        title: "Conclusion / Next Steps",
        description: "Summarize and guide forward action.",
        categorizedOutput: "string",
      },
    ],
  },
};

export const categorzedOutputTemplate = [
  {
    categorizedType: "string",
    titles: [
      "Title Slide",
      "Live Example",
      "Opening Quote",
      "Storytelling",
      "Problem / Struggle",
      "Visual Impact",
      "Vision / Future",
      "Call to Action",
      "Thank You / Reflection",
      "Opening Hook",
      "Problem Slide",
      "Solution Slide",
      "Problem Statement",
      "Data Overview",
      "Conclusion / Next Steps",
    ],
  },
  {
    categorizedType: "string[]",
    titles: [
      "Agenda",
      "Key Facts",
      "Summary",
      "Checklist",
      "Core Values",
      "Benefits",
      "Insights",
      "Recommendations",
    ],
  },
  {
    categorizedType: "{ title: string, content: string }[]",
    titles: [
      "Topic Sections",
      "Timeline",
      "Q&A",
      "Step-by-Step Guide",
      "Diagram or Flowchart",
      "Resources",
      "Case Study / Proof",
      "Objection Handling",
    ],
  },
  {
    categorizedType: "{ title: string, content: string }",
    titles: ["Title & Objective"],
  },
  {
    categorizedType: "{ name: string; labels: string[]; values: number[] }[]",
    titles: ["Detailed Charts", "Infographic"],
  },
  {
    categorizedType: "{ contentA: string[], contentB: string[] }",
    titles: ["Do's & Don'ts", "Comparison"],
  },
  {
    categorizedType:
      "{ question: string; choices: string[]; answer: string }[]",
    titles: ["Quiz / Recap"],
  },
  {
    categorizedType: "{ label: string, valueA: number; valueB: number }[]",
    titles: ["Comparison"],
  },
  {
    categorizedType: "{ label: string, content: string }[]",
    titles: ["Metrics"],
  },
];
