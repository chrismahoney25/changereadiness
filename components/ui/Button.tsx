"use client";
import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-teal hover:bg-teal-dark text-white shadow-button hover:shadow-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal focus-visible:outline-offset-2",
  secondary:
    "bg-brand-pink hover:bg-brand-pink/90 text-white shadow-button hover:shadow-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal focus-visible:outline-offset-2",
  ghost:
    "bg-transparent text-brand-teal hover:text-teal-dark underline underline-offset-4",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`${sizeClasses[size]} rounded-lg transition-all duration-150 ease-out active:translate-y-0 active:shadow-md ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}


