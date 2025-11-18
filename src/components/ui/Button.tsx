'use client';

import { useTheme } from '@/context/ThemeContext';
import classNames from 'classnames';
import { forwardRef, useState, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import TransitionLink from '@/components/TransitionLink';

interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  withRipple?: boolean;
}

interface ButtonAsButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  as?: 'button';
  href?: never;
}

interface ButtonAsLink extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps | 'href'> {
  as: 'link';
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      withRipple = false,
      className,
      children,
      as = 'button',
      ...restProps
    } = props;

    const { palette } = useTheme();
    const [rippleColor] = useState(palette ? palette.accent.value : '#000');
    const [rippleStyle] = useState({ left: '50%', top: '50%' });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };
    
    const baseStyles = 'relative font-sans font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'bg-foreground text-background',
      secondary: 'bg-foreground/10 text-foreground hover:bg-foreground/20',
      ghost: 'text-foreground hover:bg-foreground/5',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-full',
    };

    const combinedClassName = classNames(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      {
        'w-full': fullWidth,
        'overflow-hidden': withRipple,
      },
      className
    );

    const rippleContent = withRipple && (
      <span
        className="absolute pointer-events-none"
        style={{
          left: rippleStyle.left,
          top: rippleStyle.top,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <span
          className={classNames(
            'block aspect-square rounded-full transition-all ease-power2-out w-[250px]',
            {
              'scale-110': isHovered,
              'scale-0': !isHovered,
            }
          )}
          style={{
            backgroundColor: `${rippleColor}`,
          }}
        />
      </span>
    );

    const content = (
      <>
        {rippleContent}
        <span className="z-10">{children}</span>
      </>
    );

    // Render as TransitionLink for internal navigation
    if (as === 'link') {
      const { href } = restProps as ButtonAsLink;
      return (
        <TransitionLink href={href} className={combinedClassName}>
          <span
            className="block w-full h-full"
            onMouseEnter={withRipple ? handleMouseEnter : undefined}
            onMouseLeave={withRipple ? handleMouseLeave : undefined}
          >
            {content}
          </span>
        </TransitionLink>
      );
    }

    // Render as button
    const buttonProps = restProps as ButtonAsButton;
    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        className={combinedClassName}
        onMouseEnter={withRipple ? handleMouseEnter : buttonProps.onMouseEnter}
        onMouseLeave={withRipple ? handleMouseLeave : buttonProps.onMouseLeave}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
