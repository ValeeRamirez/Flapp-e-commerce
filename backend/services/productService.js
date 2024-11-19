const axios = require('axios');

class ProductService {
    async getAllProducts(page = 1) {
        try {
            const response = await axios.get(`https://dummyjson.com/products?limit=10&skip=${(page - 1) * 10}`);
            return response.data.products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    // async getProductDetails(productIds) {
    //     const allProducts = await this.getAllProducts();
    //     console.log('All products:', allProducts);
    //     return productIds.map(id => {
    //         const product = allProducts.find(p => p.id.toString() === id);
    //         return {
    //             id: product.id,
    //             name: product.title,
    //             stock: product.stock,
    //             rating: product.rating
    //         };
    //     });
    // }
    async getProductDetails(productIds) {
        try {
            // Obtener cada producto individualmente
            const productPromises = productIds.map(id =>
                axios.get(`https://dummyjson.com/products/${id}`)
                    .then(response => response.data)
            );

            const products = await Promise.all(productPromises);

            return products.map(product => ({
                id: product.id,
                name: product.title,
                stock: product.stock,
                rating: product.rating
            }));
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    }

    calculateRealStock(stock, rating) {
        return Math.floor(stock / rating);
    }
}

module.exports = new ProductService();