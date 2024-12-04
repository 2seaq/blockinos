import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Box } from '@mui/material';

const pizzas = [
  { id: 1, name: 'Margherita', price: 10, image: 'pizza-margherita.png' },
  { id: 2, name: 'Pepperoni', price: 12, image: 'pizza-pepperoni.png' },
  { id: 3, name: 'Hawaiian', price: 8, image: 'pizza-hawaiian.png' },
];

const OrderPizza = ({ onCheckout }) => {
  const [selectedPizza, setSelectedPizza] = useState(null);

  const handleCheckout = () => {
    if (selectedPizza) {
      onCheckout({
        description: `Order for ${selectedPizza.name}`,
        amount: selectedPizza.price,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
        Order Your Pizza
      </Typography>
      <Grid container spacing={4}>
        {pizzas.map((pizza) => (
          <Grid item xs={12} sm={6} md={4} key={pizza.id}>
            <Card
              sx={{
                border: selectedPizza?.id === pizza.id ? '2px solid #1976d2' : 'none',
                transition: 'border 0.3s',
              }}
            >
              <CardMedia
                component="img"
                height="150"
                image={pizza.image}
                alt={pizza.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {pizza.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {pizza.price} Sats
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setSelectedPizza(pizza)}
                >
                  Select
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          disabled={!selectedPizza}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default OrderPizza;
