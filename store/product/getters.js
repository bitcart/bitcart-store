import { slug } from '@/helpers'

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
  products: ({ sale: showSale, products, highprice, categorySelected }) =>
    getProductsByCategory(getProductsUnderHighPrice(products, showSale, highprice), categorySelected),

  productFromSlugParamRoute: ({ products }) => paramSlug =>
    products.find(({ name }) => slug(name) === paramSlug),

  categories: ({ products }) =>
    ['all', ...new Set(products.map(({ category }) => category))].sort(),
  categorySelected: ({ categorySelected }) => categorySelected
}
