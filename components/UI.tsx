import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Eye, EyeOff, X } from 'lucide-react';

// --- Colors ---
// Dark Backgrounds: #0D1117 (Main), #161B22 (Cards/Inputs)
// Tiffany Green: #0ABAB5

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  fullWidth, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D1117] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-4 text-base"
  };

  const variants = {
    primary: "bg-[#0ABAB5] text-[#0D1117] hover:bg-[#089a95] focus:ring-[#0ABAB5] shadow-[0_0_15px_rgba(10,186,181,0.2)] font-bold tracking-wide",
    secondary: "bg-[#161B22] text-white hover:bg-[#21262D] focus:ring-slate-500 border border-[#30363D]",
    outline: "border border-[#30363D] bg-transparent text-slate-200 hover:bg-[#161B22] hover:border-[#0ABAB5] focus:ring-[#0ABAB5]",
    ghost: "text-slate-400 hover:bg-[#161B22] hover:text-[#0ABAB5]",
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  canToggleVisibility?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', canToggleVisibility, type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = canToggleVisibility ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-semibold leading-none text-slate-300">{label}</label>}
      <div className="relative">
        <input
          type={inputType}
          className={`flex h-11 w-full rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#0ABAB5] focus:border-[#0ABAB5] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
        {canToggleVisibility && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      {error && <p className="text-xs text-red-400 font-medium animate-pulse">{error}</p>}
    </div>
  );
};

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-semibold leading-none text-slate-300">{label}</label>}
      <select
        className={`flex h-11 w-full rounded-md border border-[#30363D] bg-[#0D1117] px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0ABAB5] focus:border-[#0ABAB5] disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        <option value="" disabled className="bg-[#0D1117]">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0D1117] text-slate-100">{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-xl border border-[#30363D] bg-[#161B22] text-slate-50 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

// --- Checkbox ---
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, error, disabled, ...props }) => {
  return (
    <div className="space-y-1">
      <div className={`flex items-start space-x-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input
          type="checkbox"
          disabled={disabled}
          className="h-5 w-5 mt-0.5 rounded border-[#30363D] bg-[#0D1117] text-[#0ABAB5] focus:ring-[#0ABAB5] focus:ring-offset-[#0D1117] disabled:cursor-not-allowed"
          {...props}
        />
        <label className={`text-sm font-medium leading-normal ${disabled ? 'text-slate-500' : 'text-slate-300 cursor-pointer hover:text-slate-200'}`}>
          {label}
        </label>
      </div>
      {error && <p className="text-xs text-red-400 font-medium pl-8">{error}</p>}
    </div>
  );
};

// --- Logo ---
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const imgSizes = {
    sm: "h-10",
    md: "h-16",
    lg: "h-24" // Adjusted to match prompt requirements better (180px in prompt is huge for components, scaling appropriately)
  };
  
  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  if (imgError) {
    return (
      <div className={`font-bold tracking-tight text-white ${textSizes[size]} font-sans ${className}`}>
        <span className="text-[#0ABAB5]">Luria</span> Mind
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
        <img 
            src="logo.png" 
            alt="Luria Mind Logo" 
            className={`${imgSizes[size]} w-auto object-contain`}
            onError={() => setImgError(true)}
        />
    </div>
  );
};

// --- Radio Card (for selection) ---
interface RadioCardProps {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
}

export const RadioCard: React.FC<RadioCardProps> = ({ selected, title, description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${
        selected 
          ? 'border-[#0ABAB5] bg-[#0ABAB5]/5 shadow-[0_0_15px_rgba(10,186,181,0.1)]' 
          : 'border-[#30363D] bg-[#0D1117] hover:border-slate-500'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
           selected ? 'border-[#0ABAB5]' : 'border-slate-600 group-hover:border-slate-400'
        }`}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#0ABAB5]" />}
        </div>
        <div>
          <h4 className={`text-base font-bold ${selected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{title}</h4>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onScrollToBottom?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onScrollToBottom }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = () => {
    if (contentRef.current && onScrollToBottom) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Allow a small buffer (e.g., 5px) for floating point inaccuracies
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        onScrollToBottom();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#30363D]">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="p-8 overflow-y-auto text-slate-300 leading-relaxed space-y-4"
        >
          {children}
        </div>

        {/* Footer with hint if needed */}
        {onScrollToBottom && (
           <div className="p-4 bg-[#0D1117] border-t border-[#30363D] text-center text-xs text-slate-500">
             Please scroll to the bottom to acknowledge.
           </div>
        )}
      </div>
    </div>
  );
};
