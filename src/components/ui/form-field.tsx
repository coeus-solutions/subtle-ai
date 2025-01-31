import React from 'react';
import { useField } from 'formik';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  darkMode?: boolean;
}

export function FormField({ label, darkMode = false, ...props }: FormFieldProps) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <div>
      <label 
        htmlFor={props.name} 
        className={cn(
          "block text-sm font-medium mb-2",
          darkMode ? "text-gray-200" : "text-gray-700"
        )}
      >
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={cn(
          "block w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
          darkMode ? [
            "bg-white/5 border-white/10",
            "text-white placeholder-gray-400",
            "focus:border-blue-500 focus:ring-blue-500/20 focus:ring-offset-black"
          ] : [
            "bg-white border-gray-300",
            "text-gray-900 placeholder-gray-400",
            "focus:border-blue-500 focus:ring-blue-500"
          ],
          hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      {hasError && (
        <p className={cn(
          "mt-2 text-sm",
          darkMode ? "text-red-400" : "text-red-600"
        )}>
          {meta.error}
        </p>
      )}
    </div>
  );
}