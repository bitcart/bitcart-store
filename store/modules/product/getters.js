import { slug } from '@/helpers'

const getProductsUnderHighPrice = (products, showSale, highprice) =>
  products.filter(({ amount }) =>
    parseFloat(amount) < highprice)

const getProductsByCategory = (products, category) =>
  products.filter(product =>
    category !== 'all'
      ? product.article === category
      : product)

export default {
  highprice: ({ highprice }) => highprice,
  showSale: ({ sale }) => sale,
  allProducts: ({ products }) => products,
  products: ({ sale: showSale, products, highprice, categorySelected }) =>
    getProductsByCategory(getProductsUnderHighPrice(products, showSale, highprice), categorySelected),

  productFromSlugParamRoute: ({ products }) => paramSlug =>
    products.find(({ title }) => slug(title) === paramSlug),

  categories: ({ products }) =>
    ['all', ...new Set(products.map(({ article }) => article))].sort(),
  categorySelected: ({ categorySelected }) => categorySelected
}
