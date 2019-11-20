const state = {
  code: null
}

const mutations = {
  setCode(state, code){
    state.code = code
  }
}

export default {
  namespase: true,
  state,
  mutations
}
