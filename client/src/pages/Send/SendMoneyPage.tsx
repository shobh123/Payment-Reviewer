import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import ModernNavbar from '../../components/Layout/ModernNavbar';
import ModernCard from '../../components/UI/ModernCard';

const SendMoneyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ModernNavbar />
      <Container maxWidth="lg" className="py-8">
        <ModernCard
          title="Send Money"
          className="text-center"
        >
          <Box className="py-12">
            <BanknotesIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-600">
              Send Money feature coming soon...
            </Typography>
          </Box>
        </ModernCard>
      </Container>
    </div>
  );
};

export default SendMoneyPage;