import { Inter, Noto_Sans_Georgian } from "next/font/google";

// Inter covers Latin and Cyrillic; Noto Sans Georgian covers Mkhedruli,
// which the original "Segoe UI" stack only rendered properly on Windows.
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const georgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-georgian",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${georgian.variable}`;
