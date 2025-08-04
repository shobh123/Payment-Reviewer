import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import GradientButton from '../../components/UI/GradientButton';
import ModernCard from '../../components/UI/ModernCard';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (formData.email && formData.password) {
        navigate('/dashboard');
      } else {
        setError('Please fill in all fields');
      }
      setLoading(false);
    }, 1000);
  };

  const socialLogins = [
    { name: 'Google', icon: '🔍', color: 'bg-red-500 hover:bg-red-600' },
    { name: 'Apple', icon: '🍎', color: 'bg-gray-800 hover:bg-gray-900' },
    { name: 'Microsoft', icon: '🔷', color: 'bg-blue-600 hover:bg-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <Container maxWidth="sm" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <IconButton
              onClick={() => navigate('/')}
              className="bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
            </IconButton>
          </motion.div>

          <ModernCard className="overflow-hidden bg-white/80 backdrop-blur-sm">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-8"
            >
              <Typography
                variant="h4"
                className="font-bold text-gray-900 mb-2"
              >
                Welcome Back! 👋
              </Typography>
              <Typography
                variant="body1"
                className="text-gray-600"
              >
                Sign in to your PaySecure account
              </Typography>
            </motion.div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <Alert severity="error" className="rounded-xl">
                  {error}
                </Alert>
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(248, 250, 252, 1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockClosedIcon className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(248, 250, 252, 1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />

              <Box className="flex items-center justify-between">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="text-blue-600"
                    />
                  }
                  label={
                    <Typography variant="body2" className="text-gray-600">
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </Box>

              <GradientButton
                type="submit"
                fullWidth
                size="large"
                loading={loading}
                variant="primary"
                glow
                className="py-4"
              >
                Sign In
              </GradientButton>
            </motion.form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="my-8"
            >
              <Divider className="text-gray-400">
                <Typography variant="body2" className="px-4 text-gray-500">
                  Or continue with
                </Typography>
              </Divider>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {socialLogins.map((social, index) => (
                <motion.button
                  key={social.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    ${social.color} text-white p-3 rounded-xl font-medium 
                    transition-all duration-200 shadow-md hover:shadow-lg
                    flex items-center justify-center space-x-2
                  `}
                >
                  <span className="text-lg">{social.icon}</span>
                  {!isMobile && (
                    <span className="text-sm">{social.name}</span>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center"
            >
              <Typography variant="body2" className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Sign up for free
                </Link>
              </Typography>
            </motion.div>
          </ModernCard>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500 text-xl">🔒</span>
                  <Typography variant="body2" className="text-gray-700 font-medium">
                    256-bit SSL Encryption
                  </Typography>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-blue-500 text-xl">🏛️</span>
                  <Typography variant="body2" className="text-gray-700 font-medium">
                    FDIC Insured
                  </Typography>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-purple-500 text-xl">⚡</span>
                  <Typography variant="body2" className="text-gray-700 font-medium">
                    Instant Verification
                  </Typography>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default LoginPage;