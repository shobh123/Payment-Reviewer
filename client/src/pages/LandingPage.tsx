import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShieldCheckIcon,
  BoltIcon,
  ChartBarIcon,
  CreditCardIcon,
  GlobeAltIcon,
  UsersIcon,
  ArrowRightIcon,
  PlayIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import GradientButton from '../components/UI/GradientButton';
import ModernCard from '../components/UI/ModernCard';
import StatCard from '../components/UI/StatCard';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Bank-Grade Security',
      description: 'Military-grade encryption and multi-factor authentication keep your money safe 24/7.',
      color: 'primary' as const,
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Send money anywhere in the world in seconds, not days. Real-time notifications included.',
      color: 'secondary' as const,
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: 'Smart Analytics',
      description: 'Track spending, analyze patterns, and make informed financial decisions with AI insights.',
      color: 'success' as const,
    },
  ];

  const stats = [
    { title: 'Active Users', value: '10M+', icon: <UsersIcon className="w-6 h-6" />, change: 15 },
    { title: 'Total Transferred', value: '$50B+', icon: <CreditCardIcon className="w-6 h-6" />, change: 23 },
    { title: 'Countries', value: '180+', icon: <GlobeAltIcon className="w-6 h-6" />, change: 8 },
    { title: 'Uptime', value: '99.9%', icon: <ShieldCheckIcon className="w-6 h-6" />, change: 0.1 },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 150, 0],
            y: [0, -75, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="lg">
          <Box className="flex justify-between items-center">
            <Typography
              variant="h4"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            >
              💳 PaySecure
            </Typography>

            <Box className="flex items-center space-x-3">
              <GradientButton
                variant="glass"
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex"
              >
                Sign In
              </GradientButton>
              <GradientButton
                variant="primary"
                onClick={() => navigate('/signup')}
                glow
              >
                Get Started
              </GradientButton>
            </Box>
          </Box>
        </Container>
      </motion.nav>

      {/* Hero Section */}
      <Container maxWidth="lg" className="relative z-10">
        <motion.div 
          className="text-center py-16"
          {...fadeInUp}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Chip
              label="✨ New: AI-Powered Fraud Detection"
              className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-medium"
              size="medium"
            />
          </motion.div>

          <Typography
            variant={isMobile ? "h2" : "h1"}
            className="font-black mb-6 text-gray-900"
            sx={{ 
              fontSize: isMobile ? '2.5rem' : '4rem',
              lineHeight: 1.1,
            }}
          >
            The Future of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Money Transfer
            </span>
          </Typography>

          <Typography
            variant="h5"
            className="mb-8 text-gray-600 font-light max-w-3xl mx-auto"
            sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}
          >
            Experience lightning-fast, secure, and beautiful money transfers. 
            Join millions who trust PaySecure for seamless financial transactions.
          </Typography>

          <Box className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <GradientButton
              variant="primary"
              size="large"
              onClick={() => navigate('/signup')}
              icon={<ArrowRightIcon className="w-5 h-5" />}
              iconPosition="end"
              glow
            >
              Start Sending Money
            </GradientButton>
            <GradientButton
              variant="glass"
              size="large"
              icon={<PlayIcon className="w-5 h-5" />}
              className="backdrop-blur-sm bg-white/80 text-gray-700 border border-gray-200 hover:bg-white/90"
            >
              Watch Demo
            </GradientButton>
          </Box>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              'Bank-grade Security',
              'Instant Transfers',
              'Global Reach'
            ].map((item, index) => (
              <Box key={item} className="flex items-center space-x-2 text-gray-600">
                <Box className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                </Box>
                <Typography variant="body1" className="font-medium">
                  {item}
                </Typography>
              </Box>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Grid container spacing={3} className="mb-20">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={stat.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                >
                  <StatCard
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    changeType={stat.change > 0 ? 'increase' : 'neutral'}
                    icon={stat.icon}
                    gradient
                    color="primary"
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mb-20"
        >
          <Typography
            variant="h3"
            className="text-center font-bold text-gray-900 mb-4"
          >
            Why Choose PaySecure?
          </Typography>
          <Typography
            variant="h6"
            className="text-center text-gray-600 mb-12 font-light"
          >
            Built for the modern world with cutting-edge technology
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + index * 0.2, duration: 0.6 }}
                >
                  <ModernCard
                    title={feature.title}
                    className="h-full text-center"
                    hoverable
                  >
                    <Box className="flex flex-col items-center">
                      <Box 
                        className={`
                          w-16 h-16 rounded-2xl flex items-center justify-center mb-4
                          ${feature.color === 'primary' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : ''}
                          ${feature.color === 'secondary' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : ''}
                          ${feature.color === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' : ''}
                          text-white shadow-lg
                        `}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="body1"
                        className="text-gray-600 mb-4"
                      >
                        {feature.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={`
                          font-semibold cursor-pointer hover:underline
                          ${feature.color === 'primary' ? 'text-blue-600' : ''}
                          ${feature.color === 'secondary' ? 'text-purple-600' : ''}
                          ${feature.color === 'success' ? 'text-green-600' : ''}
                        `}
                      >
                        Learn More →
                      </Typography>
                    </Box>
                  </ModernCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mb-20"
        >
          <ModernCard
            gradient
            className="text-center max-w-4xl mx-auto"
          >
            <Typography
              variant="h3"
              className="font-bold text-white mb-4"
            >
              Ready to Transform Your Financial Life?
            </Typography>
            <Typography
              variant="h6"
              className="text-white/90 mb-8 font-light"
            >
              Join millions who've made the switch to faster, safer, smarter money transfers.
            </Typography>
            <Box className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton
                variant="glass"
                size="large"
                onClick={() => navigate('/signup')}
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
              >
                Create Free Account
              </GradientButton>
              <GradientButton
                variant="glass"
                size="large"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
              >
                Schedule a Demo
              </GradientButton>
            </Box>
          </ModernCard>
        </motion.div>
      </Container>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/5 backdrop-blur-sm border-t border-gray-200/50">
        <Container maxWidth="lg">
          <Box className="py-8 text-center">
            <Typography variant="body2" className="text-gray-600">
              © 2024 PaySecure. All rights reserved. Making money transfer beautiful.
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;