<script>
import Cart from "@/pages/cart.vue"
export default {
  ...Cart,
  middleware: "storeRedirect",
}
</script>
