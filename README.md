# 🧠 AI Presenter – AI-Powered Document Analyzer & Presenter

**File Presenter** is a Next.js 15 application that transforms your static documents into dynamic, presentation-ready content. Upload a PDF, spreadsheet, or other file type — and let the app intelligently extract the core data, visualize it, and export it as a beautiful presentation.

---

## ✨ Example Transformation

| 📄 Original PDF                                                                 | 🎞️ AI-Generated Presentation                                                   |
|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| ![Original PDF](./public/images/original-pdf.png)                               | ![Generated Presentation](./public/images/generated-pptx.png)                   |

> From research reports to business data — instantly convert documents into shareable slide decks.

---

## 📚 Key Features

- 📄 PDF parsing and text extraction
- 📊 Excel file reading and visualization
- 🎞️ PowerPoint slide generation
- 🤖 AI-powered summarization and data interpretation
- 🧠 Converts unstructured content into actionable insights

---

## 🚀 Core Tech Stack

| Purpose                | Library           | Description                                                                 |
|------------------------|-------------------|-----------------------------------------------------------------------------|
| 📄 PDF Parsing         | `pdfjs-dist`      | Extracts raw text and metadata from PDF documents                          |
| 🧠 PDF Interpretation  | `unpdf`           | AI-powered tool to analyze and summarize PDFs intelligently                |
| 📊 Excel Support       | `xlsx`            | Parses `.xlsx` spreadsheet files and converts data into usable formats     |
| 📽️ Presentation Output| `pptxgenjs`       | Generates `.pptx` PowerPoint presentations programmatically                |

> These four libraries form the core of the document-to-presentation pipeline.

---

## 🛠️ Getting Started

### Requirements

- Node.js 18+
- pnpm or npm

### Installation

```bash
git clone https://github.com/your-username/file-presentor.git
cd file-presentor
pnpm install
pnpm dev
