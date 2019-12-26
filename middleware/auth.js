const firebase = require('firebase/app')
require('firebase/auth')

export default function({ store, route, redirect }) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      store.dispatch('setUserInfo', user)
      if (route.name === 'facility') {
        store.commit('setIsUserAuthChecked', true)
      } else {
        redirect('/facility')
      }
    } else {
      if (route.name !== 'index') {
        redirect('/')
        return
      }
      store.commit('setIsUserAuthChecked', true)
    }
  })
}
