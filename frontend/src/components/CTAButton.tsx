import { ChevronRight } from "lucide-react";
import type { CTAButtonProps } from "../types/components";

/**
 * Consistent CTA Button Component for "Profită de oferta de presale — 99,90 lei/lună"
 * Ensures consistent text wrapping, alignment, and styling across all instances
 */
export function CTAButton({
  children,
  className = "",
  size = "medium",
  width = "auto",
  onClick
}: CTAButtonProps & { fullWidth?: boolean; href?: string }) {
  const sizeClasses: Record<string, string> = {
    small: "px-4 py-2 text-sm sm:text-base min-h-[2.5rem]",
    medium: "px-5 py-3 text-base sm:text-lg min-h-[3rem]",
    large: "px-6 py-4 text-lg sm:text-xl min-h-[3.5rem]"
  };

  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--fa-orange)] text-white font-semibold shadow hover:bg-[var(--fa-orange-600)] transition-colors";
  const widthClass = width === "full" ? "w-full" : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      <span className="text-center leading-tight cta-button-text max-w-[240px] sm:max-w-none flex-1">
        {children}
      </span>
      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ml-1" />
    </button>
  );
}
