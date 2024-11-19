import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InitialView() {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();

    const generateRandomCart = async () => {
        try {
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            console.log('Random number:', randomNumber);
            const response = await axios.get(`https://dummyjson.com/carts/${randomNumber}`);            console.log('Response:', response.data);
            const randomCart = response.data.products.map(p => ({
                productId: p.id.toString(),
                price: p.price,
                quantity: p.quantity,
                discount: Math.floor(Math.random() * 10)
            }));
            setCart(randomCart);
        } catch (error) {
            console.error('Error generando carrito:', error);
        }
    };

    const goToCheckout = () => {
        if (cart) {
            navigate('/checkout', { state: { cart } });
        }
    };

    return (
        <div>
            <h1>Flapp E-Commerce</h1>
            <button onClick={generateRandomCart}>Generar Carrito</button>
            <button
                onClick={goToCheckout}
                disabled={!cart}
            >
                Finalizar Compra
            </button>
        </div>
    );
}

export default InitialView;