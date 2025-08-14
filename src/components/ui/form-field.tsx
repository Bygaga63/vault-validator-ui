import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input } from "./input";
import { forwardRef } from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, touched, className, ...props }, ref) => {
    const hasError = error && touched;
    
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </Label>
        <Input
          ref={ref}
          className={cn(
            "transition-colors",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {hasError && (
          <p className="text-sm text-destructive mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";