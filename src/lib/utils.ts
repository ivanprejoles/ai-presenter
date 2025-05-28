import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyArrayBuffer(buffer: ArrayBuffer): ArrayBuffer {
  if (buffer.byteLength === 0) {
    throw new Error("Cannot copy detached ArrayBuffer");
  }
  const copy = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(copy).set(new Uint8Array(buffer));
  return copy;
}

export function truncateText(text: string, limit: number = 20): string {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}
