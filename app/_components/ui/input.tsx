import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Input types that we currently support
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "search";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: InputType;
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      variant = "default",
      fullWidth = true,
      className,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const baseInputStyles =
      "h-[40px] rounded-[8px] text-[14px] font-medium text-primary placeholder:text-placeholder";

    const variantStyles = {
      default:
        "bg-transparent outline-1 -outline-offset-1 outline-border outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-brand",
      filled: "bg-background border border-border focus:border-brand",
      outlined: "bg-transparent border border-border focus:border-brand",
    };

    const containerStyles = cn(
      "relative inline-flex flex-col gap-1",
      fullWidth && "w-full",
      disabled && "opacity-50 cursor-not-allowed"
    );

    const inputStyles = cn(
      baseInputStyles,
      variantStyles[variant],
      startIcon ? "pl-10" : "pl-[14px]",
      endIcon && "pr-10",
      error && "!outline-error !border-error",
      className
    );

    return (
      <div className={containerStyles}>
        {label && (
          <label className="text-sm font-medium text-primary">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {startIcon}
            </span>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            className={inputStyles}
            {...props}
          />

          {endIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {endIcon}
            </span>
          )}
        </div>

        {(error || helperText) && (
          <span
            className={cn("text-xs", error ? "text-error" : "text-gray-500")}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
