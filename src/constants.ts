/**
 * Constants and types used throughout the application
 * Includes theme definitions, default states, and configuration options
 */

interface Theme {
  bg: string;
  text: string;
  font: string;
  name: string;
}

interface State {
  content: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  textAlign: "left" | "center" | "right";
  padding: number;
  maxWidth: number;
  lineHeight: number;
  letterSpacing: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  borderRadius: number;
  shadow: boolean;
}

const FONT_FAMILIES: string[] = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Comic Sans MS",
  "Impact",
];

const PRESET_THEMES: Record<string, Theme> = {
  minimal: { bg: "#ffffff", text: "#1f2937", font: "Inter", name: "Minimal" },
  dark: { bg: "#111827", text: "#f9fafb", font: "Inter", name: "Dark Mode" },
  ocean: { bg: "#0f172a", text: "#0ea5e9", font: "Roboto", name: "Ocean" },
  sunset: { bg: "#fef3c7", text: "#dc2626", font: "Georgia", name: "Sunset" },
  forest: {
    bg: "#064e3b",
    text: "#6ee7b7",
    font: "Montserrat",
    name: "Forest",
  },
  vintage: { bg: "#f5f5dc", text: "#8b4513", font: "Georgia", name: "Vintage" },
  neon: { bg: "#0a0a0a", text: "#00ff88", font: "Courier New", name: "Neon" },
  pastel: { bg: "#fdf2f8", text: "#be185d", font: "Poppins", name: "Pastel" },
};

const DEFAULT_STATE: State = {
  content:
    "Welcome to the Enhanced Text to Image Generator!\n\nCreate stunning visual content from your text with professional styling options.\n\n✨ Choose from beautiful themes\n🎨 Customize colors and fonts\n📱 Perfect for social media\n💼 Great for presentations",
  fontSize: 20,
  fontFamily: "Inter",
  textColor: "#1f2937",
  backgroundColor: "#ffffff",
  textAlign: "left",
  padding: 32,
  maxWidth: 800,
  lineHeight: 1.6,
  letterSpacing: 0,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  borderRadius: 0,
  shadow: false,
};

export { FONT_FAMILIES, PRESET_THEMES, DEFAULT_STATE };
export type { Theme, State };
