export default {
  highprice: ({ highprice }) => highprice,
  maxprice: ({ maxprice }) => maxprice,
  showSale: ({ sale }) => sale,
  allProducts: ({ products }) => products,
  products: ({ products }) => products,
  productFromSlugParamRoute: ({ products, productId }) => products.find(({ id }) => id === productId),
  categories: ({ categories }) => categories,
  categorySelected: ({ categorySelected }) => categorySelected
}
