export const context = {
  commit (type, payload) {
    return `${type}: ${payload}`
  },
  state: {
    auth: {
      headers: {
        uid: null
      }
    }
  }
}

export const api = (response) => ({
  post: () => Promise.resolve(response),
  get: () => Promise.resolve(response)
})
