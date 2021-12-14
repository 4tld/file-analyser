export const mutations = {
  CHANGE_VALUE (state, { parent, node, quantity }) {
    state[parent][node] = Math.round((state[parent][node] + quantity) * 100) / 100
  },
  ERECT_PENIS (state, { status }) {
    state.penis.erect = status
  },
}
