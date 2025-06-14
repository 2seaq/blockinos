import React, { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import OrderPizza from './components/OrderPizza';
import InvoiceStatus from './components/InvoiceStatus';
import Alert from '@mui/material/Alert';


const App = () => {
  const [invoice, setInvoice] = useState(null);
  const [order, setOrder] = useState(null);

  const handleCheckout = async (orderIn) => {
    try {
      const response = await fetch('https://blockinos.osys.com/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderIn),
      });
      const data = await response.json();
      setInvoice(data);
      setOrder(orderIn);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const resetApplication = () => {
    setInvoice(null);
    setOrder(null);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Box mb={4}>
          <Alert severity="info">This is a Bitcoin Lightning Testnet4 application. Code at https://github.com/2seaq/blockinos</Alert>
          <Alert severity="info">Visit www.osys.com for details on testnet lightning nodes to connect to.</Alert>
        </Box>
        <Box textAlign="center" mb={4}>
  <Typography
    variant="h3"
    component="h1"
    sx={{
      fontWeight: 800,
      letterSpacing: 2,
      fontFamily: `'Pacifico', cursive`, // Use a fun logo-style font
      color: 'primary.main',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    }}
  >
    🍕 Blockinos Pizza
  </Typography>
</Box>
        <OrderPizza onCheckout={handleCheckout} />
        {invoice && (
          <Box mt={4}>
            <InvoiceStatus invoice={invoice} order={order} onClose={resetApplication} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default App;
