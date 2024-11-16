import { formatUnits } from "viem";
import { safeBigInt } from "./utils";
import { ShopItemPrice } from "@/types";

const DECIMALS = (n: number, m = n) =>
    new Intl.NumberFormat("en-US", {
        notation: "standard",
        maximumFractionDigits: n,
        minimumFractionDigits: m,
    });

const COMPACT_DECIMALS = (n: number, m = n) =>
    new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: n,
        minimumFractionDigits: m,
    });


type Formatter = Intl.NumberFormat | string;
type FormatterRule = { lt?: number; lte?: number; formatter: Formatter };

const TOKEN_SHORT: FormatterRule[] = [
    { lte: 0, formatter: "0" },
    { lt: 0.0001, formatter: "<0.0001" },
    { lt: 0.01, formatter: DECIMALS(4) },
    { lt: 1, formatter: DECIMALS(3) },
    { lt: 1_000_000, formatter: DECIMALS(2) },
    { lt: 1_000_000_000_000, formatter: COMPACT_DECIMALS(2) },
    { lt: Infinity, formatter: "SO MUCH" },
];

const TOKEN_LONG: FormatterRule[] = [
    { lte: 0, formatter: "0" },
    { lt: 0.0001, formatter: "<0.0001" },
    { lt: 100_000, formatter: DECIMALS(5, 2) },
    { lt: 1_000_000_000_000, formatter: DECIMALS(2) },
    { lt: Infinity, formatter: "HMM, A LOT" },
];



const FORMATTERS = { TOKEN_SHORT, TOKEN_LONG, };

type FormatterType = keyof typeof FORMATTERS;

export const formatNumber = (value: number, type: FormatterType) => {
    if (isNaN(value)) return "NaN";

    const rules = FORMATTERS[type];
    const rule = rules.find((rule) =>
        rule.lt !== undefined ? value < rule.lt : value <= (rule?.lte ?? 0)
    );

    if (!rule) throw new Error("No formatter found");
    return typeof rule.formatter === "string"
        ? rule.formatter
        : rule.formatter.format(value);
};


export const formatShopItemPrice = (
    price: ShopItemPrice,
    type: FormatterType = "TOKEN_SHORT"
) => {
    const value = price.uint
        ? formatUnits(safeBigInt(price.uint) ?? BigInt(0), price.token.decimals)
        : 0;
    return formatNumber(Number(value), type);
};

export const formatTwitterHandle = (handle: string): string => {
  if (handle.startsWith("@")) {
    return handle;
  }
  return `@${handle}`;
}