import React, { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import OrderPizza from './components/OrderPizza';
import InvoiceStatus from './components/InvoiceStatus';
import Alert from '@mui/material/Alert';
//import CheckIcon from '@mui/icons-material/Check';
import config from '../config.json';

const pizzaserver = config.pizzaserver;

const App = () => {
  const [invoice, setInvoice] = useState(null);
  const [order, setOrder] = useState(null);

  const handleCheckout = async (orderIn) => {
    try {
      const response = await fetch(`${pizzaserver}/create-invoice`, {
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

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
      <Box mb={4}><Alert severity="warning">This is a Bitcoin Testnet4 application. Code at https://github.com/2seaq/blockinos</Alert></Box>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" color="primary">
            Blockinos Pizza
          </Typography>
        </Box>
        <OrderPizza onCheckout={handleCheckout} />
        {invoice && (
          <Box mt={4}>
            <InvoiceStatus invoice={invoice} order={order} />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default App;
