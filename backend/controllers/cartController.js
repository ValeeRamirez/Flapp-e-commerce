const ProductService = require('../services/productService');

class CartController {
    async processCart(req, res) {
        try {
            const cart = req.body;
            const productDetails = await ProductService.getProductDetails(
                cart.map(item => item.productId)
            );

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

            console.log('Carrito recibido y procesado:', processedCart);

            const isCartValid = processedCart.every(
                item => item.requestedQuantity <= item.realStock
            );

            res.json({
                isValidCart: isCartValid
            });
        } catch (error) {
            res.status(500).json({ error: 'Error procesando carrito' });
        }
    }
}

module.exports = new CartController();