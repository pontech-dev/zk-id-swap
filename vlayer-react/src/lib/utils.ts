import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const safeBigInt = (value: string | bigint) => {
  try {
    return typeof value === "string" ? BigInt(value) : value;
  } catch {
    return null;
  }
};

export const formatDate = (date: number) => {
  const y = new Date(date).getFullYear();
  const m = new Date(date).getMonth() + 1;
  const d = new Date(date).getDate();
  return `${y}/${m}/${d}`;
};
