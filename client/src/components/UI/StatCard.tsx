import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  gradient?: boolean;
  glassmorphism?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'primary',
  gradient = false,
  glassmorphism = false,
}) => {
  const getColorClasses = () => {
    if (gradient) {
      switch (color) {
        case 'primary':
          return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white';
        case 'secondary':
          return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white';
        case 'success':
          return 'bg-gradient-to-br from-green-500 to-green-600 text-white';
        case 'warning':
          return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white';
        case 'error':
          return 'bg-gradient-to-br from-red-500 to-red-600 text-white';
        default:
          return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white';
      }
    }
    return 'bg-white text-gray-900';
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-500';
      case 'decrease':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <ArrowUpIcon className="w-4 h-4" />;
      case 'decrease':
        return <ArrowDownIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={`
          ${getColorClasses()}
          ${glassmorphism ? 'backdrop-blur-lg bg-white/10 border border-white/20' : ''}
          transition-all duration-300 hover:shadow-xl
        `}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          height: '100%',
          ...(glassmorphism && {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }),
        }}
      >
        <CardContent className="p-6">
          <Box className="flex items-start justify-between mb-4">
            <Typography
              variant="body2"
              className={`font-medium ${gradient ? 'text-white/80' : 'text-gray-600'}`}
            >
              {title}
            </Typography>
            {icon && (
              <Box className={`p-2 rounded-lg ${gradient ? 'bg-white/20' : 'bg-gray-100'}`}>
                {icon}
              </Box>
            )}
          </Box>

          <Typography
            variant="h4"
            className={`font-bold mb-2 ${gradient ? 'text-white' : 'text-gray-900'}`}
          >
            {value}
          </Typography>

          {change !== undefined && (
            <Box className="flex items-center">
              <span className={`flex items-center ${getChangeColor()}`}>
                {getChangeIcon()}
                <Typography variant="body2" className="ml-1 font-medium">
                  {Math.abs(change)}%
                </Typography>
              </span>
              <Typography
                variant="body2"
                className={`ml-2 ${gradient ? 'text-white/70' : 'text-gray-500'}`}
              >
                vs last month
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;