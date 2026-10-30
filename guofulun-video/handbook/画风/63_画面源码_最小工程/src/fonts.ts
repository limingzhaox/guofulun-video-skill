import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// 拉丁字形与中文字形分开加载：先匹配拉丁，缺字时回落到中文字体
const faces: [string, string, string][] = [
  ["SerifL", "serif-latin-600.woff2", "600"],
  ["SerifL", "serif-latin-900.woff2", "900"],
  ["SerifC", "serif-sc-600.woff2", "600"],
  ["SerifC", "serif-sc-900.woff2", "900"],
  ["SansL", "sans-latin-500.woff2", "500"],
  ["SansL", "sans-latin-700.woff2", "700"],
  ["SansL", "sans-latin-900.woff2", "900"],
  ["SansC", "sans-sc-500.woff2", "500"],
  ["SansC", "sans-sc-700.woff2", "700"],
  ["SansC", "sans-sc-900.woff2", "900"],
];

for (const [family, file, weight] of faces) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, display: "block" });
}

export const SERIF = "SerifL, SerifC, serif";
export const SANS = "SansL, SansC, sans-serif";
