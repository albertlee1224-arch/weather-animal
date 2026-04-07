/**
 * 날씨 동물 — Reusable UI Components
 *
 * Container, Button, Badge
 * Bright weather theme, design token based
 */

import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';


/* ═══════════════════════════════════════════
   Container
   ═══════════════════════════════════════════ */

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  fullHeight?: boolean;
}

export function Container({
  children,
  fullHeight = false,
  className = '',
  ...props
}: ContainerProps) {
  return (
    <div
      className={`container-app ${fullHeight ? 'min-h-dvh flex flex-col' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}


/* ═══════════════════════════════════════════
   Button
   ═══════════════════════════════════════════ */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  color,
  children,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const variantClass = `btn btn-${variant}`;

  const dynamicStyle: React.CSSProperties = { ...style };

  if (color) {
    if (variant === 'primary') {
      dynamicStyle.backgroundColor = color;
      dynamicStyle.color = '#FFFFFF';
    } else if (variant === 'secondary') {
      dynamicStyle.borderColor = color;
      dynamicStyle.color = color;
    }
  }

  return (
    <button
      className={`${variantClass} ${className}`}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </button>
  );
}


/* ═══════════════════════════════════════════
   Badge
   ═══════════════════════════════════════════ */

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  bg?: string;
  fg?: string;
  children: ReactNode;
}

export function Badge({
  bg,
  fg,
  children,
  className = '',
  style,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`badge ${className}`}
      style={{
        backgroundColor: bg ?? 'rgba(0,0,0,0.05)',
        color: fg ?? 'var(--text-secondary)',
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
