const axios = require('axios');

class ProductService {
    async getAllProducts() {
        let allProducts = [];
        let page = 1;

        try {
            let response = await axios.get(`https://dummyjson.com/products?limit=10&skip=0`);
            const totalProducts = response.data.total;
            allProducts = [...allProducts, ...response.data.products];

            while (allProducts.length < totalProducts) {
                response = await axios.get(`https://dummyjson.com/products?limit=10&skip=${page * 10}`);
                allProducts = [...allProducts, ...response.data.products];
                page++;
            }
            return allProducts;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getProductDetails(productIds) {
        const allProducts = await this.getAllProducts();
        return productIds.map(id => {
            const product = allProducts.find(p => p.id.toString() === id);
            return {
                id: product.id,
                name: product.title,
                stock: product.stock,
                rating: product.rating
            };
        });
    }

    calculateRealStock(stock, rating) {
        return Math.floor(stock / rating);
    }
}

module.exports = new ProductService();