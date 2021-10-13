import React from "react";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import useStyles from './cartStyles'
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
const Cart = ({ cart,handleUpdateCartQty,handleRemoveFromCart, handleEmptyCart }) => {

  const classes=useStyles()

  const EmptyCart = () => (
    <Typography variant="subtitle1">
      You have no item in your shopping cart, start adding some!
      <Link to='/' className={classes.link}>start adding some</Link>
    </Typography>
  );

  const FilledCart = () => (
    <div>
      <Grid container spacing={3}>
        {cart.line_items.map((item) => (
          <Grid items xs={12} sm={4} key={item.id}>
            <div><CartItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart}/></div>
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <Typography variant="h4">
          Subtotal: {cart.subtotal.formatted_with_symbol}
        </Typography>
     
      <div>
        <Button
          className={classes.emptyButton}
          size="large"
          type="button"
          variant="contained"
          color="secondary"
          onClick={handleEmptyCart}
        >
          Empty Cart
        </Button>

        <Button
          className={classes.checkoutButton}
          size="large"
          type="button"
          variant="contained"
          color="primary"
          component={Link}
          to='/checkout'
        >
          Checkout
        </Button>
      </div>
   
    </div>
    </div>
 
  )
  if(!cart.line_items) return 'Loading...'
  return (
    <Container>
      <div className={classes.toolbar} />
      <Typography claassName={classes.title} variant="h3" gutterBottom>
        Your Shopping Cart
      </Typography>
      {!cart.line_items.length ? <EmptyCart /> : <FilledCart />}
    </Container>
  );
};

export default Cart;