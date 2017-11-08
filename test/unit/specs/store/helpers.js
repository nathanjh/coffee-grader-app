export const context = {
  commit (type, payload) {
    return `${type}: ${payload}`
  },
  state: {
    auth: {
      headers: {
        uid: null
      }
    },
    cupping: {
      id: 1
    }
  },
  rootState: {
    sessions: {
      auth: {
        headers: null
      },
      user: {
        id: null
      }
    }
  }
}

export const api = (response) => ({
  post: () => Promise.resolve(response),
  get: () => Promise.resolve(response)
})
