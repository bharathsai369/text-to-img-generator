import type { ReactNode } from "react";
import {
  // Bold,
  // Italic,
  // Underline,
  // Type,
  // AlignLeft,
  // AlignCenter,
  // AlignRight,
  Palette,
  // Move3D,
  // Sparkles,
} from "lucide-react";
import { PRESET_THEMES, type Theme } from "./constants";

interface ToolbarButtonProps {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  title: string;
  variant?: "default" | "theme";
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  active = false,
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

interface ControlGroupProps {
  label: string;
  children: ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const ControlGroup: React.FC<ControlGroupProps> = ({
  label,
  children,
  icon: Icon,
}) => (
  <div className="space-y-3">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 tracking-tight">
      {Icon && <Icon size={16} className="text-gray-500" />}
      {label}
    </label>
    {children}
  </div>
);

interface SliderControlProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  unit?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const SliderControl: React.FC<SliderControlProps> = ({
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

interface ColorControlProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const ColorControl: React.FC<ColorControlProps> = ({
  value,
  onChange,
  label,
  icon: Icon,
}) => (
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

interface ThemeSelectorProps {
  onThemeSelect: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeSelect }) => (
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

export {
  ToolbarButton,
  ControlGroup,
  SliderControl,
  ColorControl,
  ThemeSelector,
};
