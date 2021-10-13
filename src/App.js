import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import CheckOut from "./components/CheckOut";
import { commerce } from "./lib/commerce";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [order, setOrder]= useState({})
  const [errorMessage, setErrorMessage]= useState('')
  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };
  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const handleAddCart = async (productID, quantity) => {
    const response = await commerce.cart.add(productID, quantity);
    setCart(response.cart);
  };

  const handleUpdateCartQty = async (productID, quantity) => {
    const response = await commerce.cart.update(productID, { quantity });
    setCart(response.cart);
  };

  const handleRemoveFromCart = async (productID) => {
    const response = await commerce.cart.remove(productID);
    setCart(response.cart);
  };

  const handleEmptyCart = async () => {
    const response = await commerce.cart.empty();
    setCart(response.cart);
  };

  const refreshCart=async ()=>{
    const newCart= await commerce.cart.refresh()
    setCart(newCart)
  }

  const handleCaptureCheckout=async (checkoutToken, newOrder)=>{
    try {
      const incomingOrder= await commerce.checkout.capture(checkoutToken, newOrder)
      setOrder(incomingOrder)
      refreshCart()
    } catch (error) {
      setErrorMessage(error.data.error.message)
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);
  console.log(products);
  console.log(cart);
  return (
    <Router>
      <Navbar totalItems={cart.total_items} />
      <Switch>
        <Route exact path="/">
          <Products products={products} onAddToCart={handleAddCart} />
        </Route>
        <Route exact path="/cart">
          <Cart
            cart={cart}
            handleUpdateCartQty={handleUpdateCartQty}
            handleRemoveFromCart={handleRemoveFromCart}
            handleEmptyCart={handleEmptyCart}
          />
        </Route>
        <Route exact path='/checkout'>
          <CheckOut cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage}/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
