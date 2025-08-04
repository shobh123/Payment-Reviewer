import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import ModernNavbar from '../../components/Layout/ModernNavbar';
import ModernCard from '../../components/UI/ModernCard';
import StatCard from '../../components/UI/StatCard';
import GradientButton from '../../components/UI/GradientButton';

const Dashboard: React.FC = () => {
  // Sample data
  const recentTransactions = [
    { id: 1, type: 'sent', amount: 250.00, recipient: 'John Doe', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'received', amount: 1200.00, sender: 'Alice Smith', date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'sent', amount: 75.50, recipient: 'Bob Johnson', date: '2024-01-13', status: 'pending' },
    { id: 4, type: 'received', amount: 500.00, sender: 'Carol Brown', date: '2024-01-12', status: 'completed' },
  ];

  const monthlyData = [
    { name: 'Jan', sent: 4000, received: 2400 },
    { name: 'Feb', sent: 3000, received: 1398 },
    { name: 'Mar', sent: 2000, received: 9800 },
    { name: 'Apr', sent: 2780, received: 3908 },
    { name: 'May', sent: 1890, received: 4800 },
    { name: 'Jun', sent: 2390, received: 3800 },
  ];

  const expenseData = [
    { name: 'Food & Dining', value: 35, color: '#8884d8' },
    { name: 'Transportation', value: 20, color: '#82ca9d' },
    { name: 'Shopping', value: 25, color: '#ffc658' },
    { name: 'Bills & Utilities', value: 20, color: '#ff7c7c' },
  ];

  const quickActions = [
    { icon: <BanknotesIcon className="w-6 h-6" />, label: 'Send Money', color: 'primary' as const },
    { icon: <ArrowDownIcon className="w-6 h-6" />, label: 'Request', color: 'secondary' as const },
    { icon: <CreditCardIcon className="w-6 h-6" />, label: 'Pay Bills', color: 'success' as const },
    { icon: <ChartBarIcon className="w-6 h-6" />, label: 'Analytics', color: 'warning' as const },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ModernNavbar />
      
      <Container maxWidth="xl" className="py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <Box>
                <Typography variant="h3" className="font-bold text-gray-900 mb-2">
                  Welcome back, Alex! 👋
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                  Here's what's happening with your account today.
                </Typography>
              </Box>
              <Box className="flex items-center space-x-3 mt-4 md:mt-0">
                <IconButton className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <BellIcon className="w-5 h-5 text-gray-600" />
                </IconButton>
                <IconButton className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CogIcon className="w-5 h-5 text-gray-600" />
                </IconButton>
                <GradientButton variant="primary" icon={<PlusIcon className="w-5 h-5" />}>
                  New Transaction
                </GradientButton>
              </Box>
            </Box>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="mb-8">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Balance"
                  value="$12,456.78"
                  change={12.5}
                  changeType="increase"
                  icon={<CurrencyDollarIcon className="w-6 h-6" />}
                  gradient
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="This Month Sent"
                  value="$3,245.00"
                  change={-2.3}
                  changeType="decrease"
                  icon={<ArrowUpIcon className="w-6 h-6" />}
                  gradient
                  color="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="This Month Received"
                  value="$8,125.50"
                  change={18.2}
                  changeType="increase"
                  icon={<ArrowDownIcon className="w-6 h-6" />}
                  gradient
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Pending Transactions"
                  value="3"
                  icon={<ClockIcon className="w-6 h-6" />}
                  gradient
                  color="secondary"
                />
              </Grid>
            </Grid>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mb-8">
            <ModernCard title="Quick Actions" className="mb-6">
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} sm={3} key={action.label}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Paper
                        className={`
                          p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-lg
                          ${action.color === 'primary' ? 'hover:bg-blue-50 border border-blue-100' : ''}
                          ${action.color === 'secondary' ? 'hover:bg-purple-50 border border-purple-100' : ''}
                          ${action.color === 'success' ? 'hover:bg-green-50 border border-green-100' : ''}
                          ${action.color === 'warning' ? 'hover:bg-yellow-50 border border-yellow-100' : ''}
                        `}
                        elevation={0}
                        sx={{ borderRadius: '12px' }}
                      >
                        <Box 
                          className={`
                            w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center
                            ${action.color === 'primary' ? 'bg-blue-100 text-blue-600' : ''}
                            ${action.color === 'secondary' ? 'bg-purple-100 text-purple-600' : ''}
                            ${action.color === 'success' ? 'bg-green-100 text-green-600' : ''}
                            ${action.color === 'warning' ? 'bg-yellow-100 text-yellow-600' : ''}
                          `}
                        >
                          {action.icon}
                        </Box>
                        <Typography variant="body2" className="font-medium text-gray-800">
                          {action.label}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </ModernCard>
          </motion.div>

          <Grid container spacing={3}>
            {/* Monthly Overview Chart */}
            <Grid item xs={12} lg={8}>
              <motion.div variants={itemVariants}>
                <ModernCard title="Monthly Overview" className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#f8fafc',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar dataKey="sent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="received" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ModernCard>
              </motion.div>
            </Grid>

            {/* Expense Breakdown */}
            <Grid item xs={12} lg={4}>
              <motion.div variants={itemVariants}>
                <ModernCard title="Expense Breakdown" className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#f8fafc',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box className="mt-4">
                    {expenseData.map((item, index) => (
                      <Box key={item.name} className="flex items-center justify-between mb-2">
                        <Box className="flex items-center">
                          <Box 
                            className="w-3 h-3 rounded-full mr-2"
                            sx={{ backgroundColor: item.color }}
                          />
                          <Typography variant="body2" className="text-gray-600">
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" className="font-medium">
                          {item.value}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </ModernCard>
              </motion.div>
            </Grid>

            {/* Recent Transactions */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <ModernCard title="Recent Transactions" className="overflow-hidden">
                  <Box className="space-y-4">
                    {recentTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <Box className="flex items-center space-x-4">
                          <Box 
                            className={`
                              w-12 h-12 rounded-full flex items-center justify-center
                              ${transaction.type === 'sent' 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-green-100 text-green-600'
                              }
                            `}
                          >
                            {transaction.type === 'sent' ? (
                              <ArrowUpIcon className="w-5 h-5" />
                            ) : (
                              <ArrowDownIcon className="w-5 h-5" />
                            )}
                          </Box>
                          <Box>
                            <Typography variant="body1" className="font-medium text-gray-900">
                              {transaction.type === 'sent' 
                                ? `To ${transaction.recipient}` 
                                : `From ${transaction.sender}`
                              }
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                              {transaction.date}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="text-right">
                          <Typography 
                            variant="body1" 
                            className={`font-semibold ${
                              transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {transaction.type === 'sent' ? '-' : '+'}${transaction.amount.toFixed(2)}
                          </Typography>
                          <Chip
                            label={transaction.status}
                            size="small"
                            className={`
                              ${transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                              }
                            `}
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                  <Box className="mt-6 text-center">
                    <GradientButton variant="glass" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                      View All Transactions
                    </GradientButton>
                  </Box>
                </ModernCard>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </div>
  );
};

export default Dashboard;