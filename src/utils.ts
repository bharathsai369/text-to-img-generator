import { useRef, useCallback } from "react";
import type { State } from "./constants";

interface CanvasDimensions {
  maxWidth: number;
  padding: number;
  fontSize: number;
  lineHeight: number;
}

interface CanvasHook {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  generateCanvas: (
    text: string,
    styles: State,
    dimensions: CanvasDimensions
  ) => HTMLCanvasElement | null;
}

const useCanvas = (): CanvasHook => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateCanvas = useCallback(
    (text: string, styles: State, dimensions: CanvasDimensions) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const ctx = canvas.getContext("2d")!;
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
    },
    []
  );

  return { canvasRef, generateCanvas };
};

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const paragraphs = text.split("\n");
  const lines: string[] = [];

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

const getTextX = (
  textAlign: string,
  maxWidth: number,
  padding: number
): number => {
  switch (textAlign) {
    case "center":
      return maxWidth / 2;
    case "right":
      return maxWidth - padding;
    default:
      return padding;
  }
};

const drawUnderline = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  textAlign: string,
  color: string
) => {
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

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor: string
) => {
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

const downloadBlob = (blob: Blob | null, filename: string) => {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export {
  useCanvas,
  wrapText,
  getTextX,
  drawUnderline,
  drawRoundedRect,
  downloadBlob,
};
export type { CanvasHook, CanvasDimensions };
