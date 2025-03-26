import React, { useState, useEffect } from "react";

export function Tabs({ defaultValue, value, onChange, onValueChange, children, className = "", ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue);
  
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setSelectedValue(newValue);
    }
    // Support both onChange and onValueChange for backward compatibility
    onValueChange?.(newValue);
    onChange?.(newValue);
  };
  
  return (
    <div className={`${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        if (child.type === TabsList || child.type === TabsContent) {
          return React.cloneElement(child, {
            selectedValue,
            onValueChange: handleValueChange,
          });
        }
        
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className = "", selectedValue, onValueChange, ...props }) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, {
            selectedValue,
            onValueChange,
          });
        }
        
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ children, value, className = "", selectedValue, onValueChange, ...props }) {
  const isSelected = selectedValue === value;
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isSelected ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'} ${className}`}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className = "", selectedValue, ...props }) {
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  );
}
