import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, Box } from '@mui/material';

const pizzas = [
  { id: 1, name: 'Margherita', price: 5000, image: 'pizza-margherita.png' },
  { id: 2, name: 'Pepperoni', price: 10, image: 'pizza-pepperoni.png' },
  { id: 3, name: 'Hawaiian', price: 1, image: 'pizza-hawaiian.png' },
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
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
    <Typography
      variant="h4"
      component="h2"
      textAlign="center"
      gutterBottom
      sx={{
        fontWeight: 700,
        letterSpacing: 1,
        mb: 4,
        color: 'primary.main',
      }}
    >Order a Pizza
    </Typography>
  
    <Grid container spacing={4}>
      {pizzas.map((pizza) => (
        <Grid item xs={12} sm={6} md={4} key={pizza.id}>
          <Card
            sx={{
              height: '100%',
              transition: 'transform 0.3s, box-shadow 0.3s',
              transform: selectedPizza?.id === pizza.id ? 'scale(1.02)' : 'scale(1)',
              boxShadow:
                selectedPizza?.id === pizza.id
                  ? '0 0 15px rgba(25, 118, 210, 0.6)'
                  : '0 2px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: 3,
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={pizza.image}
              alt={pizza.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                {pizza.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Price: <strong>{pizza.price} Sats</strong>
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant={selectedPizza?.id === pizza.id ? 'contained' : 'outlined'}
                color="primary"
                fullWidth
                onClick={() => setSelectedPizza(pizza)}
              >
                {selectedPizza?.id === pizza.id ? 'Selected' : 'Order'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  
    <Box textAlign="center" mt={5}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleCheckout}
        disabled={!selectedPizza}
        sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
      >
        Checkout
      </Button>
    </Box>
  </Box>
  );
};

export default OrderPizza;
