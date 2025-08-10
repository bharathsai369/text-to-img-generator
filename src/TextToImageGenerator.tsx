import React, { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Type,
  Download,
  FileImage,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  Eye,
  Settings,
  Zap,
  Palette,
  Move3D,
  Sparkles,
} from "lucide-react";

// Enhanced constants
const FONT_FAMILIES = [
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

const PRESET_THEMES = {
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

const DEFAULT_STATE = {
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

// Enhanced canvas hook
const useCanvas = () => {
  const canvasRef = useRef(null);

  const generateCanvas = useCallback((text, styles, dimensions) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    const { maxWidth, padding, fontSize, lineHeight } = dimensions;
    const {
      fontFamily,
      textColor,
      backgroundColor,
      textAlign,
      isBold,
      isItalic,
      letterSpacing,
      borderRadius,
      shadow,
    } = styles;

    let fontStyle = "";
    if (isBold && isItalic) fontStyle = "bold italic";
    else if (isBold) fontStyle = "bold";
    else if (isItalic) fontStyle = "italic";

    ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
    ctx.letterSpacing = `${letterSpacing}px`;

    const textWidth = maxWidth - padding * 2;
    const lineHeightPx = fontSize * lineHeight;
    const lines = wrapText(ctx, text, textWidth);

    const canvasHeight = lines.length * lineHeightPx + padding * 2 + 40;

    canvas.width = maxWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, maxWidth, canvasHeight);

    // Add shadow if enabled
    if (shadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
    }

    // Draw background with border radius
    if (borderRadius > 0) {
      drawRoundedRect(
        ctx,
        0,
        0,
        maxWidth,
        canvasHeight,
        borderRadius,
        backgroundColor
      );
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, maxWidth, canvasHeight);
    }

    // Reset shadow for text
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw text
    ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
    ctx.letterSpacing = `${letterSpacing}px`;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign;

    const startY = padding + fontSize;
    let textX = getTextX(textAlign, maxWidth, padding);

    lines.forEach((line, index) => {
      const y = startY + index * lineHeightPx;
      ctx.fillText(line.trim(), textX, y);

      if (styles.isUnderline) {
        drawUnderline(ctx, line.trim(), textX, y, textAlign, textColor);
      }
    });

    return canvas;
  }, []);

  return { canvasRef, generateCanvas };
};

// Enhanced utility functions
const wrapText = (ctx, text, maxWidth) => {
  const paragraphs = text.split("\n");
  const lines = [];

  paragraphs.forEach((paragraph) => {
    if (paragraph.trim() === "") {
      lines.push("");
      return;
    }

    const words = paragraph.split(" ");
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }
  });

  return lines;
};

const getTextX = (textAlign, maxWidth, padding) => {
  switch (textAlign) {
    case "center":
      return maxWidth / 2;
    case "right":
      return maxWidth - padding;
    default:
      return padding;
  }
};

const drawUnderline = (ctx, text, x, y, textAlign, color) => {
  const metrics = ctx.measureText(text);
  let underlineX = x;

  if (textAlign === "center") {
    underlineX = x - metrics.width / 2;
  } else if (textAlign === "right") {
    underlineX = x - metrics.width;
  }

  ctx.beginPath();
  ctx.moveTo(underlineX, y + 3);
  ctx.lineTo(underlineX + metrics.width, y + 3);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(
    1,
    Math.floor(metrics.actualBoundingBoxAscent * 0.1)
  );
  ctx.stroke();
};

const drawRoundedRect = (ctx, x, y, width, height, radius, fillColor) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Enhanced components
const ToolbarButton = ({
  active,
  onClick,
  children,
  title,
  variant = "default",
}) => {
  const baseClasses =
    "p-2.5 rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  const variants = {
    default: active
      ? "bg-blue-500 text-white shadow-lg hover:bg-blue-600 transform hover:scale-105"
      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border border-gray-200 hover:border-gray-300 shadow-sm",
    theme:
      "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const ControlGroup = ({ label, children, icon: Icon }) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 tracking-tight">
      {Icon && <Icon size={16} className="text-gray-500" />}
      {label}
    </label>
    {children}
  </div>
);

const SliderControl = ({
  value,
  onChange,
  min,
  max,
  label,
  unit = "",
  icon: Icon,
}) => (
  <ControlGroup label={label} icon={Icon}>
    <div className="flex items-center space-x-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer accent-blue-500 hover:accent-blue-600"
      />
      <span className="text-sm font-medium text-gray-800 min-w-[65px] bg-gray-50 px-3 py-1.5 rounded-lg border">
        {value}
        {unit}
      </span>
    </div>
  </ControlGroup>
);

const ColorControl = ({ value, onChange, label, icon: Icon }) => (
  <ControlGroup label={label} icon={Icon}>
    <div className="flex items-center space-x-3">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-xl cursor-pointer opacity-0 absolute inset-0 z-10"
        />
        <div
          className="w-12 h-10 rounded-xl border-2 border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all shadow-sm"
          style={{ backgroundColor: value }}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-white"
        placeholder="#000000"
      />
    </div>
  </ControlGroup>
);

const ThemeSelector = ({ onThemeSelect }) => (
  <ControlGroup label="Quick Themes" icon={Palette}>
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(PRESET_THEMES).map(([key, theme]) => (
        <button
          key={key}
          onClick={() => onThemeSelect(theme)}
          className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all transform hover:scale-105 text-xs font-medium"
          style={{ backgroundColor: theme.bg, color: theme.text }}
        >
          {theme.name}
        </button>
      ))}
    </div>
  </ControlGroup>
);

// Main Component
const TextToImageGenerator = () => {
  const [state, setState] = useState(DEFAULT_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { canvasRef, generateCanvas } = useCanvas();
  const editorRef = useRef(null);

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleFormat = (command) => {
    const commands = {
      bold: () => updateState({ isBold: !state.isBold }),
      italic: () => updateState({ isItalic: !state.isItalic }),
      underline: () => updateState({ isUnderline: !state.isUnderline }),
      left: () => updateState({ textAlign: "left" }),
      center: () => updateState({ textAlign: "center" }),
      right: () => updateState({ textAlign: "right" }),
    };

    commands[command]?.();
    editorRef.current?.focus();
  };

  const resetToDefaults = () => {
    setState(DEFAULT_STATE);
  };

  const applyTheme = (theme) => {
    updateState({
      backgroundColor: theme.bg,
      textColor: theme.text,
      fontFamily: theme.font,
    });
  };

  const getPreviewStyle = () => ({
    fontFamily: state.fontFamily,
    fontSize: `${Math.max(14, state.fontSize * 0.7)}px`,
    color: state.textColor,
    backgroundColor: state.backgroundColor,
    textAlign: state.textAlign,
    fontWeight: state.isBold ? "bold" : "normal",
    fontStyle: state.isItalic ? "italic" : "normal",
    textDecoration: state.isUnderline ? "underline" : "none",
    lineHeight: state.lineHeight,
    letterSpacing: `${state.letterSpacing}px`,
    padding: `${Math.max(12, state.padding * 0.5)}px`,
    borderRadius: `${state.borderRadius}px`,
    border: "2px solid #e5e7eb",
    minHeight: "200px",
    maxHeight: "400px",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    width: "100%",
    maxWidth: `${Math.min(400, state.maxWidth * 0.6)}px`,
    outline: "none",
    boxShadow: state.shadow
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
  });

  const generateAndDownload = async (format) => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = generateCanvas(state.content, state, {
        maxWidth: state.maxWidth,
        padding: state.padding,
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
      });

      if (!canvas) throw new Error("Canvas generation failed");

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const filename = `text-image-${Date.now()}.${format}`;
            downloadBlob(blob, filename);
          }
        },
        `image/${format}`,
        format === "jpeg" ? 0.95 : 1
      );
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 md:px-8 py-6 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Type className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            Text to Image Generator
          </h1>
          <p className="text-gray-600 text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
            Transform your text into stunning visuals with professional styling
            and modern design
          </p>
        </div>

        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                  <FileText size={20} className="text-blue-500" />
                  Text Editor
                </h2>
                <button
                  onClick={resetToDefaults}
                  className="flex items-center primary gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>

              {/* Enhanced Toolbar */}
              <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl mb-6 border border-gray-200">
                <ToolbarButton
                  active={state.isBold}
                  onClick={() => handleFormat("bold")}
                  title="Bold (Ctrl+B)"
                >
                  <Bold size={16} />
                </ToolbarButton>

                <ToolbarButton
                  active={state.isItalic}
                  onClick={() => handleFormat("italic")}
                  title="Italic (Ctrl+I)"
                >
                  <Italic size={16} />
                </ToolbarButton>

                <ToolbarButton
                  active={state.isUnderline}
                  onClick={() => handleFormat("underline")}
                  title="Underline (Ctrl+U)"
                >
                  <Underline size={16} />
                </ToolbarButton>

                <div className="w-px bg-gray-300 mx-2"></div>

                <ToolbarButton
                  active={state.textAlign === "left"}
                  onClick={() => handleFormat("left")}
                  title="Align Left"
                >
                  <AlignLeft size={16} />
                </ToolbarButton>

                <ToolbarButton
                  active={state.textAlign === "center"}
                  onClick={() => handleFormat("center")}
                  title="Align Center"
                >
                  <AlignCenter size={16} />
                </ToolbarButton>

                <ToolbarButton
                  active={state.textAlign === "right"}
                  onClick={() => handleFormat("right")}
                  title="Align Right"
                >
                  <AlignRight size={16} />
                </ToolbarButton>
              </div>

              {/* Enhanced Text Area */}
              <textarea
                ref={editorRef}
                value={state.content}
                onChange={(e) => updateState({ content: e.target.value })}
                placeholder="Start typing your masterpiece here..."
                className="w-full h-72 p-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all placeholder-gray-400 text-gray-800 bg-white hover:border-gray-300"
                style={{
                  fontFamily: state.fontFamily,
                  fontSize: `${Math.min(state.fontSize, 18)}px`,
                  lineHeight: state.lineHeight,
                  color: state.textColor,
                  backgroundColor: state.backgroundColor,
                }}
              />

              {/* Enhanced Download Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => generateAndDownload("png")}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <Zap className="animate-spin" size={18} />
                  ) : (
                    <FileImage size={18} />
                  )}
                  {isGenerating ? "Creating Magic..." : "Download PNG"}
                </button>

                <button
                  onClick={() => generateAndDownload("jpeg")}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Download size={18} />
                  Download JPEG
                </button>
              </div>
            </div>

            {/* Enhanced Controls Panel */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
                  <Settings size={20} className="text-purple-500" />
                  Styling Controls
                </h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl px-4 py-2 transition-all"
                >
                  <Sparkles size={16} />
                  {showAdvanced ? "Basic" : "Advanced"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <ThemeSelector onThemeSelect={applyTheme} />

                  <ControlGroup label="Font Family" icon={Type}>
                    <select
                      value={state.fontFamily}
                      onChange={(e) =>
                        updateState({ fontFamily: e.target.value })
                      }
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800 bg-white hover:border-gray-300"
                    >
                      {FONT_FAMILIES.map((font) => (
                        <option
                          key={font}
                          value={font}
                          style={{ fontFamily: font }}
                          className="py-2"
                        >
                          {font}
                        </option>
                      ))}
                    </select>
                  </ControlGroup>

                  <SliderControl
                    label="Font Size"
                    value={state.fontSize}
                    onChange={(value) => updateState({ fontSize: value })}
                    min={12}
                    max={80}
                    unit="px"
                    icon={Type}
                  />
                </div>

                <div className="space-y-5">
                  <ColorControl
                    label="Text Color"
                    value={state.textColor}
                    onChange={(value) => updateState({ textColor: value })}
                    icon={Palette}
                  />

                  <ColorControl
                    label="Background Color"
                    value={state.backgroundColor}
                    onChange={(value) =>
                      updateState({ backgroundColor: value })
                    }
                    icon={Palette}
                  />

                  <SliderControl
                    label="Canvas Width"
                    value={state.maxWidth}
                    onChange={(value) => updateState({ maxWidth: value })}
                    min={300}
                    max={1400}
                    unit="px"
                    icon={Move3D}
                  />
                </div>
              </div>

              {showAdvanced && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <SliderControl
                    label="Padding"
                    value={state.padding}
                    onChange={(value) => updateState({ padding: value })}
                    min={10}
                    max={100}
                    unit="px"
                  />

                  <SliderControl
                    label="Line Height"
                    value={state.lineHeight}
                    onChange={(value) => updateState({ lineHeight: value })}
                    min={1}
                    max={3}
                    unit="x"
                  />

                  <SliderControl
                    label="Letter Spacing"
                    value={state.letterSpacing}
                    onChange={(value) => updateState({ letterSpacing: value })}
                    min={-2}
                    max={10}
                    unit="px"
                  />

                  <SliderControl
                    label="Border Radius"
                    value={state.borderRadius}
                    onChange={(value) => updateState({ borderRadius: value })}
                    min={0}
                    max={50}
                    unit="px"
                  />
                </div>
              )}

              {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <ControlGroup label="Effects">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.shadow}
                        onChange={(e) =>
                          updateState({ shadow: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Drop Shadow
                      </span>
                    </label>
                  </ControlGroup>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Preview Panel */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Eye size={20} className="text-green-500" />
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                Live Preview
              </h3>
            </div>

            <div className="flex justify-center">
              <div
                style={getPreviewStyle()}
                className="shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                {state.content || "Your beautiful text will appear here..."}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-6 text-center">
              Preview is scaled to fit • Export uses full dimensions
            </p>
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default TextToImageGenerator;
