import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CheckoutView() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cart, setCart] = useState(location.state?.cart || []);
    const [shippingMessage, setShippingMessage] = useState('');
    const [isCheckingShipping, setIsCheckingShipping] = useState(false);

    const calculateTotal = () => {
        return cart.reduce((total, item) =>
            total + (item.price * item.quantity), 0
        );
    };

    const checkShipping = async () => {
        setIsCheckingShipping(true);
        try {
            const cartForApi = cart.map(item => ({
                productId: item.id.toString(),
                price: item.price,
                quantity: item.quantity,
                discount: Math.floor(item.discountPercentage)
            }));

            const response = await axios.post('http://localhost:3001/api/cart', cartForApi);
            setShippingMessage(
                response.data.isValidCart
                    ? 'Envío Flapp $3.670'
                    : 'No hay envíos disponibles :('
            );
        } catch (error) {
            setShippingMessage('Error al cotizar envío');
        } finally {
            setIsCheckingShipping(false);
        }
    };

    const clearCart = () => {
        setCart([]);
        navigate('/');
    };

    const goBack = () => {
        navigate('/', { state: { cart } });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Checkout</h1>

                {cart.length === 0 ? (
                    <p className="text-center text-gray-500">Tu carrito está vacío</p>
                ) : (
                    <>
                        {cart.map(item => (
                            <div
                                key={item.productId}
                                className="border-b py-2 last:border-b-0 flex items-center space-x-4"
                            >
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-grow">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">{item.title}</span>
                                        <span className="text-gray-600">
                                            ${item.price} x {item.quantity}
                                        </span>
                                    </div>
                                    {item.discountPercentage > 0 && (
                                        <div className="text-sm text-green-600">
                                            Descuento: {item.discountPercentage.toFixed(2)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-lg font-bold">Total:</span>
                            <span className="text-xl font-bold">
                                ${calculateTotal().toFixed(2)}
                            </span>
                        </div>
                    </>
                )}

                <div className="mt-4 space-y-2">
                    <button
                        onClick={checkShipping}
                        disabled={cart.length === 0 || isCheckingShipping}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isCheckingShipping ? 'Cotizando...' : 'Cotizar Despacho'}
                    </button>

                    {shippingMessage && (
                        <p className="text-center text-sm text-gray-600 mt-2">
                            {shippingMessage}
                        </p>
                    )}
                </div>

                <div className="mt-4 space-y-2">
                    <button
                        onClick={clearCart}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                        Limpiar Carrito
                    </button>
                    <button
                        onClick={goBack}
                        className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutView;