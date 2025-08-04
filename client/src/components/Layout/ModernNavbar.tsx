import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Bars3Icon as MenuIcon,
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import GradientButton from '../UI/GradientButton';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const ModernNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    { label: 'Send Money', path: '/send', icon: <BanknotesIcon className="w-5 h-5" /> },
    { label: 'Transactions', path: '/transactions', icon: <CreditCardIcon className="w-5 h-5" /> },
    { label: 'Analytics', path: '/analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
  ];

  const userMenuItems = [
    { label: 'Profile', path: '/profile', icon: <UserIcon className="w-5 h-5" /> },
    { label: 'Settings', path: '/settings', icon: <Cog6ToothIcon className="w-5 h-5" /> },
  ];

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
    handleUserMenuClose();
  };

  const handleLogout = () => {
    // Add logout logic here
    handleUserMenuClose();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      }}
    >
      <Box className="p-4">
        <Typography variant="h6" className="font-bold text-white mb-6">
          PaySecure
        </Typography>
        
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              className={`
                mb-2 rounded-lg cursor-pointer transition-all duration-200
                ${isActive(item.path) 
                  ? 'bg-white/20 shadow-lg' 
                  : 'hover:bg-white/10'
                }
              `}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon className="text-white min-w-[40px]">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                className="text-white"
              />
            </ListItem>
          ))}
          
          <Box className="mt-6 pt-6 border-t border-white/20">
            {userMenuItems.map((item) => (
              <ListItem
                key={item.path}
                className="mb-2 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200"
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon className="text-white min-w-[40px]">
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  className="text-white"
                />
              </ListItem>
            ))}
            
            <ListItem
              className="mb-2 rounded-lg cursor-pointer hover:bg-red-500/20 transition-all duration-200"
              onClick={handleLogout}
            >
              <ListItemIcon className="text-white min-w-[40px]">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                className="text-white"
              />
            </ListItem>
          </Box>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            color: 'inherit',
          }}
        >
          <Toolbar className="px-4 lg:px-8">
            {/* Logo */}
            <Typography
              variant="h6"
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
              sx={{ flexGrow: isMobile ? 1 : 0, mr: isMobile ? 0 : 4 }}
            >
              PaySecure
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box className="flex-1 flex items-center space-x-1">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      px-4 py-2 rounded-lg transition-all duration-200
                      ${isActive(item.path)
                        ? 'bg-blue-100 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* User Actions */}
            <Box className="flex items-center space-x-3">
              {!isMobile && (
                <GradientButton
                  variant="primary"
                  size="small"
                  onClick={() => navigate('/send')}
                >
                  Send Money
                </GradientButton>
              )}

              <IconButton
                onClick={handleUserMenuOpen}
                className="p-0"
              >
                <Avatar
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600"
                  sx={{ bgcolor: 'primary.main' }}
                >
                  U
                </Avatar>
              </IconButton>

              {isMobile && (
                <IconButton
                  onClick={() => setMobileDrawerOpen(true)}
                  className="text-gray-700"
                >
                  <MenuIcon className="w-6 h-6" />
                </IconButton>
              )}
            </Box>

            {/* User Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                className: 'mt-2 min-w-[200px] shadow-xl',
                sx: {
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                },
              }}
            >
              {userMenuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Box className="flex items-center space-x-3">
                    {item.icon}
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
              
              <MenuItem
                onClick={handleLogout}
                className="px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
              >
                <Box className="flex items-center space-x-3">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <Typography variant="body2">Logout</Typography>
                </Box>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <MobileDrawer />
    </>
  );
};

export default ModernNavbar;