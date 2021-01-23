export default function ({ store, params }) {
  if (params.id) store.commit("storeID", params.id)
}
