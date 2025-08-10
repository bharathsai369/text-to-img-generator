/**
 * TextToImageGenerator Component
 * 
 * Main component that handles the text-to-image conversion functionality.
 * Provides a rich text editor interface with live preview and export options.
 */

import React, { useState, useRef } from "react";
import type { CSSProperties } from "react";
import {
  Type,
  Download,
  FileImage,
  FileText,
  RotateCcw,
  Eye,
  Settings,
  Zap,
  Sparkles,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Move3D,
} from "lucide-react";
import { FONT_FAMILIES, DEFAULT_STATE } from "./constants";
// import type { PRESET_THEMES } from "./constants";
import type { Theme, State } from "./constants";
import { useCanvas, downloadBlob } from "./utils";
import type { CanvasDimensions } from "./utils";
import {
  ToolbarButton,
  ControlGroup,
  SliderControl,
  ColorControl,
  ThemeSelector,
} from "./components";

const TextToImageGenerator: React.FC = () => {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const { canvasRef, generateCanvas } = useCanvas();
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const updateState = (updates: Partial<State>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleFormat = (command: string) => {
    const commands: Record<string, () => void> = {
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

  const applyTheme = (theme: Theme) => {
    updateState({
      backgroundColor: theme.bg,
      textColor: theme.text,
      fontFamily: theme.font,
    });
  };

  const getPreviewStyle = (): CSSProperties => ({
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

  /**
   * Generates a downloadable image from the current canvas state
   * @param format - The desired image format ('png' or 'jpeg')
   */
  const generateAndDownload = async (format: "png" | "jpeg") => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = generateCanvas(state.content, state, {
        maxWidth: state.maxWidth,
        padding: state.padding,
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
      } as CanvasDimensions);

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
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
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
