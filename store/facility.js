import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const storage = firebase.storage()
const userRef = db.collection('users')
const metadata = {
  cacheControl: 'private,max-age=300'
}

export const state = () => ({
  facilities: [],
  newFacilities: [],
  loading: false
})

export const mutations = {
  add(state, { data, id }) {
    const addData = {
      id,
      data
    }
    state.facilities = state.facilities.concat([addData])
  },
  modify(state, { data, id }) {
    state.facilities.some((v, i, a) => {
      if (v.id === id) {
        a[i].data = data
        return true
      }
    })
  },
  delete(state, id) {
    state.facilities = state.facilities.filter(f => f.id !== id)
  },
  setLoading(state, value) {
    state.loading = value
  },
  addNewFacility(state, { data, id }) {
    const addData = {
      id,
      data
    }
    state.newFacilities = state.newFacilities.concat([addData])
  },
  removeNewFacility(state, id) {
    state.newFacilities = state.newFacilities.filter(f => f.id !== id)
  }
}

export const actions = {
  async listen({ commit, state, getters, rootGetters }) {
    console.log('start listen')
    const facilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')
      .orderBy('modified', 'desc')

    facilityRef.onSnapshot({ includeMetadataChanges: true }, snapshot => {
      snapshot.docChanges().forEach(change => {
        // 変更があった際の処理たち
        // 初回はaddedが件数分だけ一個ずつ取得される、毎回全件分呼ばれると課金待ったなしなので
        // 一回全件取得して日付でフィルターして監視してもいいかも…
        // まあキャッシュされるからそんな大事ではない。
        if (change.type === 'added') {
          console.log('added')
          commit('add', { data: change.doc.data(), id: change.doc.id })
          if (change.doc.data().modified == null) {
            // firestoreから取得していて、かつ新規データだったらフロントで検知して写真追加モーダルを表示
            console.log('new data!!!!!!!!')
            commit('addNewFacility', {
              data: change.doc.data(),
              id: change.doc.id
            })
          }
        } else if (change.type === 'modified') {
          console.log('modified')
          commit('modify', { data: change.doc.data(), id: change.doc.id })
          if (change.doc.data().modified == null) {
            commit('addNewFacility', {
              data: change.doc.data(),
              id: change.doc.id
            })
          }
        } else if (change.type === 'removed') {
          console.log('removed')
          commit('delete', change.doc.id)
        }
        const source = snapshot.metadata.fromCache ? 'local cache' : 'server'
        console.log('Data came from ' + source)
      })
    })
  },
  create({ commit, rootGetters }, data) {
    const facilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')

    data.created = firebase.firestore.Timestamp.fromDate(new Date())
    facilityRef.add(data)
  },
  update({ rootGetters }, { data, id }) {
    const facilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')
    if (data.modified != null) {
      data.modified = firebase.firestore.Timestamp.fromDate(new Date())
    }
    facilityRef.doc(id).set(data)
  },
  delete({ rootGetters }, id) {
    const facilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')

    facilityRef.doc(id).delete()
  },
  upload({ commit, rootGetters }, { userUid, facilityId, file }) {
    const facilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')
    const fileName = userUid + Date.now() + '.jpg'
    // storageのarea_imagesへの参照を定義
    var uploadRef = storage.ref(`users/${userUid}`).child(fileName)
    uploadRef.put(file, metadata).then(snapshot => {
      uploadRef
        .getDownloadURL()
        .then(url => {
          // thenでアップロードしたファイルのurlを取得
          commit('removeNewFacility', facilityId)
          return facilityRef.doc(facilityId).update({
            image: url,
            modified: firebase.firestore.Timestamp.fromDate(new Date())
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  },
  uploadByString({ commit, rootGetters }, { userUid, facilityId, file }) {
    const facilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')
    const fileName = userUid + Date.now() + '.jpg'
    var uploadRef = storage.ref(`users/${userUid}`).child(fileName)
    uploadRef.putString(file, 'data_url', metadata).then(snapshot => {
      uploadRef
        .getDownloadURL()
        .then(url => {
          // thenでアップロードしたファイルのurlを取得
          commit('removeNewFacility', facilityId)
          return facilityRef.doc(facilityId).update({
            image: url,
            modified: firebase.firestore.Timestamp.fromDate(new Date())
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  },
  skipUploadImage({ commit, rootGetters }, facilityId) {
    const facilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')

    commit('removeNewFacility', facilityId)
    return facilityRef.doc(facilityId).update({
      modified: firebase.firestore.Timestamp.fromDate(new Date())
    })
  }
}

export const getters = {
  getfacilities(state) {
    return state.facilities
  },
  getNewFacilities(state) {
    return state.newFacilities
  },
  getFacilityNameById: state => id => {
    const obj = state.facilities.find(f => f.id === id)
    if (obj == null) return '（削除済み設備）'
    return obj.data.name
  }
}
