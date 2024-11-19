const ProductService = require('../services/productService');

class CartController {
    async processCart(req, res) {
        try {
            const cart = req.body;
            console.log('Carrito recibido:', cart);
            console.log('Obteniendo detalles de los productos...');
            // Obtener detalles de los productos
            const productDetails = await ProductService.getProductDetails(
                cart.map(item => item.productId)
            );
            console.log(productDetails);

            // Procesar cada producto del carrito
            const processedCart = cart.map(cartItem => {
                const productDetail = productDetails.find(
                    p => p.id.toString() === cartItem.productId
                );

                const realStock = ProductService.calculateRealStock(
                    productDetail.stock,
                    productDetail.rating
                );

                return {
                    id: cartItem.productId,
                    name: productDetail.name,
                    unitPrice: cartItem.price,
                    totalDiscount: cartItem.discount * cartItem.quantity,
                    requestedQuantity: cartItem.quantity,
                    obtainedStock: productDetail.stock,
                    rating: productDetail.rating,
                    realStock: realStock
                };
            });

            // Imprimir carrito procesado
            console.log('Carrito procesado:', processedCart);

            // Verificar si el carrito puede ser procesado
            const isCartValid = processedCart.every(
                item => item.requestedQuantity <= item.realStock
            );

            res.json({
                cart: processedCart,
                isValidCart: isCartValid
            });
        } catch (error) {
            res.status(500).json({ error: 'Error procesando carrito' });
        }
    }
}

module.exports = new CartController();