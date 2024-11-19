import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CheckoutView() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cart, setCart] = useState(location.state?.cart || []);
    const [shippingMessage, setShippingMessage] = useState('');

    const calculateTotal = () => {
        return cart.reduce((total, item) =>
            total + (item.price * item.quantity), 0
        );
    };

    const checkShipping = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/cart', cart);
            setShippingMessage(
                response.data.isValidCart
                    ? 'Envío Flapp $3.670'
                    : 'No hay envíos disponibles :('
            );
        } catch (error) {
            setShippingMessage('Error al cotizar envío');
        }
    };

    const clearCart = () => {
        setCart([]);
        navigate('/');
    };

    const goBack = () => {
        navigate('/');
    };

    return (
        <div>
            <h1>Checkout</h1>
            {cart.map(item => (
                <div key={item.productId}>
                    <p>Producto: {item.productId}</p>
                    <p>Precio: ${item.price}</p>
                    <p>Cantidad: {item.quantity}</p>
                </div>
            ))}
            <p>Total: ${calculateTotal()}</p>

            <button onClick={checkShipping}>Cotizar Despacho</button>
            <p>{shippingMessage}</p>

            <button onClick={clearCart}>Limpiar Carrito</button>
            <button onClick={goBack}>Volver</button>
        </div>
    );
}

export default CheckoutView;