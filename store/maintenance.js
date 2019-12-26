import firebase from '~/plugins/firebase'
const db = firebase.firestore()
const storage = firebase.storage()
const userRef = db.collection('users')
const metadata = {
  cacheControl: 'private,max-age=300'
}

export const state = () => ({
  recentRecords: [],
  searchedRecords: [],
  searching: false,
  newRecords: [],
  records: {},
  loading: false
})

export const mutations = {
  add(state, { data, id }) {
    // 一応お作法として参照型にしてるけどidしか使わないんだよなぁ…
    data.facility = data.facility.id
    const addData = {
      id,
      data
    }
    state.recentRecords = state.recentRecords.concat([addData])
  },
  addSearched(state, { data, id }) {
    data.facility = data.facility.id
    const addData = {
      id,
      data
    }
    state.searchedRecords = state.searchedRecords.concat([addData])
  },
  setSearching(state) {
    state.searching = true
    state.searchedRecords = []
  },
  clearSearching(state) {
    state.searching = false
  },
  modify(state, { data, id }) {
    data.facility = data.facility.id
    state.recentRecords.some((v, i, a) => {
      if (v.id === id) {
        a[i].data = data
        return true
      }
    })
    // 画像アップロード成功時の処理
    state.newRecords.some((v, i, a) => {
      if (v.id === id) {
        a[i].data = data
        return true
      }
    })
  },
  modifySearched(state, { data, id }) {
    data.facility = data.facility.id
    state.searchedRecords.forEach((v, i, a) => {
      if (v.id === id) {
        a[i].data = data
        return true
      }
    })
  },

  delete(state, id) {
    state.recentRecords = state.recentRecords.filter(f => f.id !== id)
  },
  setLoading(state, value) {
    state.loading = value
  },
  addNewRecord(state, { data, id }) {
    data.facility = data.facility.id || data.facility
    const addData = {
      id,
      data
    }
    state.newRecords = state.newRecords.concat([addData])
  },
  removeNewRecord(state, id) {
    state.newRecords = state.newRecords.filter(f => f.id !== id)
  }
}

export const actions = {
  async listen({ commit, state, rootGetters }) {
    const maintenanceRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('maintenance')

    let dt = new Date()
    //1か月前を最近とする。時刻は０時にしておく（なるべくキャッシュから拾いたいので）
    dt.setHours(0, 0, 0, 0)
    dt.setMonth(dt.getMonth() - 1)
    const maintenanceRefFiltered = maintenanceRef
      .orderBy('created', 'desc')
      .where('created', '>', dt)
    maintenanceRefFiltered.onSnapshot(
      { includeMetadataChanges: true },
      snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            commit('add', { data: change.doc.data(), id: change.doc.id })
            if (change.doc.data().modified == null) {
              // 新規データだったらフロントで検知して写真追加モーダルを表示
              commit('addNewRecord', {
                data: change.doc.data(),
                id: change.doc.id
              })
            }
          } else if (change.type === 'modified') {
            commit('modify', { data: change.doc.data(), id: change.doc.id })
            commit('modifySearched', {
              data: change.doc.data(),
              id: change.doc.id
            })
          } else if (change.type === 'removed') {
            commit('delete', change.doc.id)
          }
          var source = snapshot.metadata.fromCache ? 'local cache' : 'server'
        })
      }
    )
  },
  search({ commit, state, rootGetters }, monthBefore = 1) {
    const facilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')
    const maintenanceRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('maintenance')

    commit('setSearching')
    let dt = new Date()
    //1か月前を最近とする。時刻は０時にしておく（なるべくキャッシュから拾いたいので）
    dt.setHours(0, 0, 0, 0)
    dt.setMonth(dt.getMonth() - monthBefore)
    const maintenanceRefFiltered = maintenanceRef
      .orderBy('created', 'desc')
      .where('created', '>', dt)
    maintenanceRefFiltered
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          commit('addSearched', { data: doc.data(), id: doc.id })
        })
        commit('clearSearching')
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error)
      })
  },
  execMaintenance({ commit, rootGetters }, { photo, memo, facilityId }) {
    const maintenanceRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('maintenance')

    const parentFacilityRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('facility')
      .doc(facilityId)
    let data = {
      memo,
      images: [],
      facility: parentFacilityRef,
      created: firebase.firestore.Timestamp.fromDate(new Date())
    }
    if (!photo) {
      data.modified = firebase.firestore.Timestamp.fromDate(new Date())
    }
    maintenanceRef.add(data)
  },
  delete({ rootGetters }, id) {
    const maintenanceRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('maintenance')

    maintenanceRef.doc(id).delete()
  },
  upload({ commit, rootGetters }, { userUid, task, file }) {
    const maintenanceRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('maintenance')

    const maintenanceId = task.id
    const fileName = userUid + Date.now() + '.jpg'
    // storageのarea_imagesへの参照を定義
    var uploadRef = storage.ref(`users/${userUid}`).child(fileName)
    uploadRef.put(file, metadata).then(snapshot => {
      uploadRef
        .getDownloadURL()
        .then(url => {
          // thenでアップロードしたファイルのurlを取得
          return maintenanceRef.doc(maintenanceId).update({
            images: firebase.firestore.FieldValue.arrayUnion(url)
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  },
  uploadByString({ commit, rootGetters }, { userUid, task, file }) {
    const maintenanceRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('maintenance')

    const maintenanceId = task.id
    const fileName = userUid + Date.now() + '.jpg'
    var uploadRef = storage.ref(`users/${userUid}`).child(fileName)
    uploadRef.putString(file, 'data_url', metadata).then(snapshot => {
      uploadRef
        .getDownloadURL()
        .then(url => {
          // thenでアップロードしたファイルのurlを取得
          return maintenanceRef.doc(maintenanceId).update({
            images: firebase.firestore.FieldValue.arrayUnion(url)
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  },
  skipUploadImage({ commit, rootGetters }, maintenanceId) {
    const maintenanceRef = userRef
      .doc(rootGetters.getUserUid)
      .collection('maintenance')

    commit('removeNewRecord', maintenanceId)
    return maintenanceRef.doc(maintenanceId).update({
      modified: firebase.firestore.Timestamp.fromDate(new Date())
    })
  }
}

export const getters = {
  getRecentRecords(state) {
    return state.recentRecords
  },
  getSearchedRecords(state) {
    return state.searchedRecords
  },
  isSearching(state) {
    return state.searching
  },
  getNewRecords(state) {
    return state.newRecords
  }
}
