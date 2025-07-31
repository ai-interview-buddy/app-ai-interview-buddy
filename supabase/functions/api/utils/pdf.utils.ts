import { resolvePDFJS } from "npm:pdfjs-serverless";
import { PdfContent } from "../types/PdfContent.ts";

export type TextItem = {
  str: string;
  dir: "ltr" | "rtl";
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
};

const NO_SPACE_BEFORE = new Set([".", ",", ";", ":", ")", "]", "!", "?", "%", "”", "’", '"', "'"]);

function smartJoin(tokens: string[]): string {
  return tokens.reduce((line, token) => {
    if (!token) return line;
    return line === "" ? token : NO_SPACE_BEFORE.has(token[0]) ? line + token : line + " " + token;
  }, "");
}

function itemsToText(items: TextItem[]): string {
  const lines: string[] = [];
  let current: string[] = [];

  for (const i of items) {
    const str = i.str?.trim();
    if (str) current.push(str);
    if (i.hasEOL) {
      lines.push(smartJoin(current));
      current = [];
    }
  }

  if (current.length) lines.push(smartJoin(current));
  return lines.join("\n");
}

export const readPdf = async (fileArray: ArrayBuffer): Promise<PdfContent> => {
  const { getDocument } = await resolvePDFJS();

  const doc = await getDocument({
    data: fileArray,
    useSystemFonts: true,
    // disableWorker: true, // safer for Supabase Edge
  }).promise;

  const parts: string[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const text = itemsToText(textContent.items as TextItem[]);
    parts.push(text);
  }

  await doc.destroy();

  return {
    pageCount: doc.numPages,
    content: parts.join("\n\n"), // blank line between pages
  };
};
