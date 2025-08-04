import React from 'react';
import { Card, CardContent, CardHeader, CardActions } from '@mui/material';
import { motion } from 'framer-motion';

interface ModernCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  elevation?: number;
  gradient?: boolean;
  glassmorphism?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  elevation = 1,
  gradient = false,
  glassmorphism = false,
  hoverable = true,
  onClick
}) => {
  const cardClasses = `
    ${className}
    ${gradient ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white' : ''}
    ${glassmorphism ? 'backdrop-blur-lg bg-white/20 border border-white/30 shadow-glass' : ''}
    ${hoverable ? 'transition-all duration-300 hover:transform hover:scale-105 hover:shadow-large' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `.trim();

  const CardComponent = motion.div;

  return (
    <CardComponent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { y: -5 } : {}}
    >
      <Card 
        elevation={elevation}
        className={cardClasses}
        onClick={onClick}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          ...(glassmorphism && {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }),
          ...(gradient && {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            color: 'white',
          }),
        }}
      >
        {(title || subtitle) && (
          <CardHeader
            title={title}
            subheader={subtitle}
            className="pb-2"
            titleTypographyProps={{
              variant: 'h6',
              className: 'font-semibold'
            }}
            subheaderTypographyProps={{
              className: gradient ? 'text-gray-100' : 'text-gray-600'
            }}
          />
        )}
        
        <CardContent className="pt-0">
          {children}
        </CardContent>
        
        {actions && (
          <CardActions className="px-4 pb-4">
            {actions}
          </CardActions>
        )}
      </Card>
    </CardComponent>
  );
};

export default ModernCard;