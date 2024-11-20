import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function InitialView() {
    const location = useLocation();
    const [cart, setCart] = useState(location.state?.cart || null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const generateRandomCart = async () => {
        setIsLoading(true);
        try {
            const randomNumber = Math.floor(Math.random() * 10) + 1;
            const response = await axios.get(`https://dummyjson.com/carts/${randomNumber}`);
            setCart(response.data.products);
        } catch (error) {
            console.error('Error generando carrito:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const goToCheckout = () => {
        if (cart) {
            navigate('/checkout', { state: { cart } });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Flapp E-Commerce</h1>
                <div className="space-y-4">
                    <button
                        onClick={generateRandomCart}
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? 'Generando...' : 'Generar Carrito'}
                    </button>
                    <button
                        onClick={goToCheckout}
                        disabled={!cart || isLoading}
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        Finalizar Compra
                    </button>

                    {cart && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold mb-2">Carrito Actual:</h2>
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.title}</span>
                                    <span>${item.price} x {item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InitialView;