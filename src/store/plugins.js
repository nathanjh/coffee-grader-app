import { STORAGE_KEY } from './modules/sessions'

const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    const syncedData = { user: state.sessions.user, auth: state.sessions.auth }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedData))
  })
}

export default [localStoragePlugin]
