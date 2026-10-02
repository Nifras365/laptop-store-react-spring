import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaLock, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import apiClient from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PageShell, PageHeader, LoadingState, ErrorBanner } from '../components/ui';
import StripeProvider from '../components/StripeProvider';
import { useToast } from '../contexts/ToastContext';
import '../pagescss/checkout.css';

const CheckoutForm = ({ cartItems, subtotal, clientSecret, orderId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {
            // 1. Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: 'Test User', // In a real app, this would be from user's profile
                    },
                },
            });

            if (error) {
                setPaymentError(error.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // 2. Confirm payment with our backend
                const confirmResponse = await apiClient.post('/payments/confirm', {
                    orderId: orderId,
                    paymentIntentId: paymentIntent.id
                });

                if (confirmResponse.status === 200) {
                    addToast('Payment successful! Your order has been placed.', 'success');
                    navigate('/orders', { replace: true, state: { orderSuccess: true, orderId: orderId } });
                } else {
                    setPaymentError('Payment captured, but failed to confirm order on server.');
                }
            }
        } catch (err) {
            console.error("Error confirming payment:", err);
            setPaymentError("An unexpected error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form-container">
            <h4 className="checkout-section-title">Payment Details</h4>
            
            <div className="test-card-banner">
                <FaInfoCircle />
                <div>
                    <strong>Test Mode Active:</strong> Use card number <span className="test-card-number">4242 4242 4242 4242</span> with any future date and CVC.
                </div>
            </div>

            {paymentError && (
                <div className="payment-error">
                    {paymentError}
                </div>
            )}

            <div className="stripe-card-element">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="pay-btn"
            >
                {isProcessing ? (
                    <>
                        <span className="loading-spinner loading-spinner-sm" style={{borderColor: 'white', borderTopColor: 'transparent'}}></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <FaLock /> Pay {new Intl.NumberFormat('en-US').format(subtotal)} LKR
                    </>
                )}
            </button>
            <p className="text-center text-muted mt-3 mb-0" style={{fontSize: '0.85rem'}}>
                Payments are securely processed by Stripe.
            </p>
        </form>
    );
};

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userID } = useAuth();
    const [clientSecret, setClientSecret] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intentCreated = useRef(false);

    // Get cart data from navigation state
    const { cartItems, subtotal } = location.state || { cartItems: [], subtotal: 0 };

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
            return;
        }

        if (intentCreated.current) return;
        intentCreated.current = true;

        const createPaymentIntent = async () => {
            try {
                const orderItems = cartItems.map(item => ({
                    laptopID: item.laptopID,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice
                }));

                const response = await apiClient.post('/payments/create-intent', {
                    userId: parseInt(userID),
                    amount: subtotal,
                    orderItems: orderItems
                });

                if (response.status === 200 && response.data.data) {
                    setClientSecret(response.data.data.clientSecret);
                    setOrderId(response.data.data.orderId);
                } else {
                    setError("Failed to initialize payment. Please try again later.");
                }
            } catch (err) {
                console.error("Error creating payment intent:", err);
                setError("Could not connect to payment server. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        createPaymentIntent();
    }, []);

    if (loading) {
        return (
            <PageShell>
                <LoadingState message="Initializing secure checkout..." fullPage />
            </PageShell>
        );
    }

    if (error) {
        return (
            <PageShell>
                <PageHeader title="Checkout Error" showBack backTo="/cart" />
                <ErrorBanner message={error} />
                <div className="text-center mt-4">
                    <button className="btn btn-primary" onClick={() => navigate('/cart')}>
                        Return to Cart
                    </button>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <PageHeader title="Secure Checkout" showBack backTo="/cart" />

            <Container className="checkout-container">
                <Row className="checkout-layout">
                    <Col lg={7}>
                        {clientSecret && (
                            <StripeProvider options={{ clientSecret }}>
                                <CheckoutForm 
                                    cartItems={cartItems} 
                                    subtotal={subtotal} 
                                    clientSecret={clientSecret}
                                    orderId={orderId}
                                />
                            </StripeProvider>
                        )}
                    </Col>
                    
                    <Col lg={5}>
                        <div className="checkout-summary">
                            <h4 className="checkout-section-title">Order Summary</h4>
                            
                            <div className="checkout-items-list">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="checkout-item">
                                        <div className="checkout-item-details">
                                            <span className="checkout-item-title">{item.laptop?.model || `Laptop #${item.laptopID}`}</span>
                                            <span className="checkout-item-qty">Qty: {item.quantity}</span>
                                        </div>
                                        <div className="checkout-item-price">
                                            {new Intl.NumberFormat('en-US').format(item.totalPrice)} LKR
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout-totals">
                                <div className="checkout-total-row">
                                    <span>Subtotal</span>
                                    <span>{new Intl.NumberFormat('en-US').format(subtotal)} LKR</span>
                                </div>
                                <div className="checkout-total-row">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="checkout-total-row final-total">
                                    <span>Total</span>
                                    <span>{new Intl.NumberFormat('en-US').format(subtotal)} LKR</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </PageShell>
    );
};

export default Checkout;
