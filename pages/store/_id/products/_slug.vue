<script>
import Product from "@/pages/products/_slug.vue"
export default {
  ...Product,
  middleware: "storeRedirect",
}
</script>
