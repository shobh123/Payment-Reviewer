import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import ModernNavbar from '../../components/Layout/ModernNavbar';
import ModernCard from '../../components/UI/ModernCard';

const ReceiveMoneyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ModernNavbar />
      <Container maxWidth="lg" className="py-8">
        <ModernCard
          title="Receive Money"
          className="text-center"
        >
          <Box className="py-12">
            <ArrowDownIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-600">
              Receive Money feature coming soon...
            </Typography>
          </Box>
        </ModernCard>
      </Container>
    </div>
  );
};

export default ReceiveMoneyPage;