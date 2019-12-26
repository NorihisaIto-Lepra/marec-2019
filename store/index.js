import firebase from '~/plugins/firebase'

export const state = () => ({
  showing: 'facility',
  isUserAuthChecked: false,
  userUid: '',
  userName: ''
})

export const mutations = {
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  changeShowing(state, changeTo) {
    state.showing = changeTo
  },
  setIsUserAuthChecked(state, changeTo) {
    state.isUserAuthChecked = changeTo
  }
}

export const actions = {
  async login({ commit, dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        dispatch('setUserInfo', result.user)
        return result
      })
      .catch(function(error) {
        var errorCode = error.code
        console.log('error : ' + errorCode)
        throw error
      })
  },
  logout({ commit, dispatch }) {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.href = '/'
      })
      .catch(function(error) {
        var errorCode = error.code
        console.log('error : ' + errorCode)
        throw error
      })
  },
  setUserInfo({ commit }, user) {
    commit('setUserUid', user.uid)
    commit('setUserName', user.displayName)
  }
}

export const getters = {
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
  isShowingFacility(state) {
    return state.showing === 'facility'
  },
  isShowingMaintenance(state) {
    return state.showing === 'maintenance'
  },
  isUserAuthChecked(state) {
    return state.isUserAuthChecked
  }
}
