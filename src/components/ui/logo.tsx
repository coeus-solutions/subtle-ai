import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function Logo({ className, showText = true, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative p-2 rounded-lg overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)'
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" className="relative z-10">
          {/* Stylized S */}
          <path 
            d="M6 6C9 6 12 7 12 9C12 11 6 10 6 12C6 14 9 15 12 15" 
            stroke="white" 
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-dash"
          />
          {/* AI Dots */}
          <circle cx="14" cy="6" r="1.2" fill="white" className="animate-pulse" />
          <circle cx="16" cy="8" r="1.2" fill="white" className="animate-pulse [animation-delay:150ms]" />
        </svg>
      </div>
      {showText && (
        <span className={cn(
          "font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text",
          textClassName
        )}>
          SubtleAI
        </span>
      )}
    </div>
  );
} 