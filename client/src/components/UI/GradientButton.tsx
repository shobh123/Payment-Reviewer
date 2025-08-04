import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'glass';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  gradient?: boolean;
  glow?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  icon,
  iconPosition = 'start',
  gradient = true,
  glow = false,
  size = 'medium',
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    const baseStyles = 'font-semibold transition-all duration-300 transform border-0';
    
    switch (variant) {
      case 'primary':
        return gradient
          ? `${baseStyles} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl ${glow ? 'shadow-blue-500/25 hover:shadow-blue-500/40' : ''}`
          : `${baseStyles} bg-blue-500 hover:bg-blue-600 text-white`;
      
      case 'secondary':
        return gradient
          ? `${baseStyles} bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl ${glow ? 'shadow-purple-500/25 hover:shadow-purple-500/40' : ''}`
          : `${baseStyles} bg-purple-500 hover:bg-purple-600 text-white`;
      
      case 'success':
        return gradient
          ? `${baseStyles} bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl ${glow ? 'shadow-green-500/25 hover:shadow-green-500/40' : ''}`
          : `${baseStyles} bg-green-500 hover:bg-green-600 text-white`;
      
      case 'warning':
        return gradient
          ? `${baseStyles} bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl ${glow ? 'shadow-yellow-500/25 hover:shadow-yellow-500/40' : ''}`
          : `${baseStyles} bg-yellow-500 hover:bg-yellow-600 text-white`;
      
      case 'error':
        return gradient
          ? `${baseStyles} bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl ${glow ? 'shadow-red-500/25 hover:shadow-red-500/40' : ''}`
          : `${baseStyles} bg-red-500 hover:bg-red-600 text-white`;
      
      case 'glass':
        return `${baseStyles} bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-glass`;
      
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 text-sm min-h-[36px]';
      case 'large':
        return 'px-8 py-4 text-lg min-h-[56px]';
      default:
        return 'px-6 py-3 text-base min-h-[44px]';
    }
  };

  const buttonContent = (
    <>
      {loading ? (
        <CircularProgress 
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
          color="inherit" 
          className="mr-2"
        />
      ) : (
        icon && iconPosition === 'start' && (
          <span className="mr-2">{icon}</span>
        )
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'end' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={`${getVariantStyles()} ${getSizeStyles()} ${className} rounded-xl overflow-hidden relative`}
        disabled={disabled || loading}
        onClick={onClick}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          position: 'relative',
          overflow: 'hidden',
          '&:before': gradient ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          } : {},
          '&:hover:before': gradient ? {
            left: '100%',
          } : {},
        }}
        {...props}
      >
        {buttonContent}
      </Button>
    </motion.div>
  );
};

export default GradientButton;