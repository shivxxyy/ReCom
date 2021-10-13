import React, { useEffect, useState } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline
} from "@material-ui/core";
import useStyles from "./checkoutStyles.js";
import AddressForm from "./AddressForm.js";
import PaymentForm from "./PaymentForm.js";
import { commerce } from "../lib/commerce.js";
import { Link ,useHistory} from "react-router-dom";

const steps = ["Shipping Address", "Payment Details"];

const CheckOut = ({ cart, order, error, onCaptureCheckout}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished]= useState(false)
  const classes = useStyles();
  const history= useHistory()

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });
        setCheckoutToken(token);
      } catch (error) {
        history.pushState('/')
      }
    };
    generateToken();
  }, [cart]);
  const nextStep = () => setActiveStep((prevStep) => prevStep + 1);
  const backStep = () => setActiveStep((prevStep) => prevStep - 1);

  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  const timeout=()=>{
    setTimeout(() => {
      setIsFinished(true)
    }, 3000);
  }

  let Confirmation = () => order.customer?( <div>
    <div>
      <Typography variant='h5'>Thank You for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
      <Divider className={classes.divider}/>
      <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
    </div>
    <br/>
    <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
  </div>): isFinished ? (
    <div>
    <div>
      <Typography variant='h5'>Thank You for your purchase!</Typography>
      <Divider className={classes.divider}/>
    </div>
    <br/>
    <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
  </div>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress/>
    </div>
  )

  if(error){
    <>
    <Typography variant='h5'>Error: {error}</Typography>
    <br/>
    <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
    </>
  }

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
        nextStep={nextStep}
        timeout={timeout}
      />
    );
  return (
    <div>
    <CssBaseline/>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.Paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </div>
  );
};

export default CheckOut;
