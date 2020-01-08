const getProductsUnderHighPrice = (products, showSale, highprice) =>
  products.filter(({ amount }) =>
    parseFloat(amount) < highprice)

const getProductsByCategory = (products, category) =>
  products.filter(product =>
    category !== 'all'
      ? product.category === category
      : product)

export default {
  highprice: ({ highprice }) => highprice,
  showSale: ({ sale }) => sale,
  allProducts: ({ products }) => products,
  products: ({ sale: showSale, products, highprice, categorySelected }) => getProductsByCategory(getProductsUnderHighPrice(products, showSale, highprice), categorySelected),
  productFromSlugParamRoute: ({ products, productId }) => products.find(({ id }) => id === productId),
  categories: ({ categories }) => categories,
  categorySelected: ({ categorySelected }) => categorySelected
}
