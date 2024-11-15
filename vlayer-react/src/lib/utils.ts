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