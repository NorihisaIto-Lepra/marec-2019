<template>
  <div class="fill-height">
    <transition name="component-fade" mode="out-in">
      <FacilityList v-if="isShowingFacility" @click="onClickRow" />
      <TableMaintenance
        v-if="isShowingMaintenance"
        :items="newMaintenanceRecords"
        @select="showImageViewer"
      />
    </transition>
    <template v-if="isShowingFacility">
      <v-slide-y-reverse-transition>
        <v-btn
          v-if="!selected.id"
          color="primary"
          dark
          bottom
          right
          fixed
          fab
          @click="onClickButtonAdd"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-slide-y-reverse-transition>
    </template>
    <v-dialog v-model="dialog" persistent max-width="720px">
      <FacilityCardBasic
        v-if="isActiveEditInfo"
        :facility="selected.data"
        :isNew="isNew"
        :sending="sending"
        @close="closeDialog"
        @save="onSaveBasicInfo($event)"
      />
      <FacilityCardMaintenance
        v-else-if="isActiveMaintenance"
        :sending="sending"
        @close="closeDialog"
        @ok="onOkMaintenance($event)"
      />
      <FacilityCardDelete
        v-else-if="isActiveDelete"
        :sending="sending"
        @close="closeDialog"
        @ok="onOkDelete"
      />
    </v-dialog>
    <v-dialog v-model="dialogForAddImage" persistent max-width="720px">
      <CardAddImage
        v-if="newFacilities.length > 0"
        :task="newFacilities"
        @upload="onUploadImage($event, 'facility')"
        @uploadByString="onUploadImageByString($event, 'facility')"
        @skip="onSkipUploadImage($event, 'facility')"
      />
      <CardAddImageMulti
        color="maintenance"
        v-else-if="newMaintenanceRecords.length > 0"
        :task="newMaintenanceRecords"
        @upload="onUploadImage($event, 'maintenance')"
        @uploadByString="onUploadImageByString($event, 'maintenance')"
        @skip="onSkipUploadImage($event, 'maintenance')"
      />
    </v-dialog>
    <ImageDialog
      v-model="showImageDialog"
      :images="imagesForViewer"
      @add="addImage"
    />
    <v-bottom-navigation
      v-if="isShowingFacility"
      :input-value="Boolean(selected.id)"
      color="white"
      grow
      background-color="primary"
      fixed
      style="font-color: white !important; opacity: 1 !important;"
    >
      <v-fade-transition>
        <!--
        <span v-if="selected.id" class="selected-text primary lighten-4">
          選択中: {{ selected.data.place }} の {{ selected.data.name }}
        </span>-->
      </v-fade-transition>
      <v-btn @click="onClickButtonEdit">
        <span>詳細表示</span>
        <v-icon>mdi-playlist-edit</v-icon>
      </v-btn>
      <v-btn @click="onClickButtonMaintenance">
        <span>整備</span>
        <v-icon>mdi-wrench-outline</v-icon>
      </v-btn>
      <v-btn @click="onClickButtonDelete">
        <span>削除</span>
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import TableMaintenance from '@/components/TableMaintenance'
import FacilityCardBasic from '@/components/FacilityCardBasic'
import FacilityCardMaintenance from '@/components/FacilityCardMaintenance'
import FacilityCardDelete from '@/components/FacilityCardDelete'
import CardAddImage from '@/components/CardAddImage'
import CardAddImageMulti from '@/components/CardAddImageMulti'
import ImageDialog from '@/components/ImageDialog'
import FacilityList from '@/components/FacilityList'
export default {
  components: {
    TableMaintenance,
    FacilityCardBasic,
    FacilityCardMaintenance,
    FacilityCardDelete,
    CardAddImage,
    CardAddImageMulti,
    ImageDialog,
    FacilityList
  },
  data() {
    return {
      selected: { id: '', data: null },
      search: '',
      sending: false,
      dialog: false,
      currentItem: null,
      showImageDialog: false,
      dialogForAddImage: false,
      isActiveEditInfo: false,
      isNew: false,
      isActiveMaintenance: false,
      isActiveDelete: false,
      imagesForViewer: [],
      headers: [
        {
          text: '名称',
          value: 'data.name',
          align: 'left',
          sortable: false
        },
        { text: '設置場所', value: 'data.place' },
        { text: 'メモ', value: 'data.memo' }
      ],
      fab: false
    }
  },
  computed: {
    activeFab() {
      switch (this.tabs) {
        case 'one':
          return { class: 'purple', icon: 'account_circle' }
        case 'two':
          return { class: 'red', icon: 'edit' }
        case 'three':
          return { class: 'green', icon: 'keyboard_arrow_up' }
        default:
          return {}
      }
    },
    newFacilities() {
      return this.$store.getters['facility/getNewFacilities']
    },
    newMaintenanceRecords() {
      return this.$store.getters['maintenance/getNewRecords']
    },
    showing() {
      return this.$store.state.showing
    },
    isShowingFacility() {
      return this.$store.getters.isShowingFacility
    },
    isShowingMaintenance() {
      return this.$store.getters.isShowingMaintenance
    }
  },
  watch: {
    newFacilities(newVal, oldVal) {
      if (!navigator.onLine) return
      // 初回読み込み時にはnewFacilitiesが一気にn個入ってくるので複数叩かれることはないけど一応
      if (newVal.length > 0 && !this.dialogForAddImage) {
        this.dialogForAddImage = true
      }
      if (oldVal.length > 0 && newVal.length === 0) {
        this.dialogForAddImage = false
      }
    },
    newMaintenanceRecords(newVal, oldVal) {
      if (!navigator.onLine) return
      // 初回読み込み時にはnewFacilitiesが一気にn個入ってくるので複数叩かれることはないけど一応
      if (newVal.length > 0 && !this.dialogForAddImage) {
        this.dialogForAddImage = true
      }
      if (oldVal.length > 0 && newVal.length === 0) {
        this.dialogForAddImage = false
      }
    },
    showImageDialog(newVal) {
      if (newVal) return
      this.imagesForViewer = []
    },
    isActiveEditInfo(newVal) {
      if (newVal) return
      this.selected = { id: '', data: null }
    }
  },
  methods: {
    onClickRow(item) {
      if (this.selected.id === item.id) {
        this.clearClickRow()
        return
      }
      this.selected = item
    },
    clearClickRow() {
      this.selected = { id: '', data: null }
    },
    onClickButtonMaintenance() {
      this.isActiveMaintenance = true
      this.openDialog()
    },
    onClickButtonEdit() {
      this.isNew = false
      this.isActiveEditInfo = true
      this.openDialog()
    },
    onClickButtonDelete() {
      this.isActiveDelete = true
      this.openDialog()
    },
    onClickButtonAdd() {
      this.isNew = true
      this.isActiveEditInfo = true
      this.openDialog()
    },
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
      this.$nextTick(() => {
        this.isActiveEditInfo = false
        this.isActiveMaintenance = false
        this.isActiveDelete = false
        this.selected = { id: '', data: null }
      })
    },
    onSaveBasicInfo(e) {
      this.sending = true
      if (this.isNew) {
        this.$store.dispatch('facility/create', e)
      } else {
        this.$store.dispatch('facility/update', {
          data: e,
          id: this.selected.id
        })
      }
      this.sending = false
      this.dialog = false
      this.$nextTick(() => {
        this.closeDialog()
      })
    },
    onOkDelete() {
      this.sending = true
      this.$store.dispatch('facility/delete', this.selected.id)
      this.sending = false
      this.clearClickRow()
      this.closeDialog()
    },
    onOkMaintenance({ photo, memo }) {
      this.$store.dispatch('maintenance/execMaintenance', {
        photo,
        memo,
        facilityId: this.selected.id
      })
      this.clearClickRow()
      this.closeDialog()
    },
    /*
    onUploadImage({ file, task }, kind) {
      switch (kind) {
        case 'maintenance':
          this.$store.dispatch('maintenance/upload', {
            userUid: this.$store.getters.getUserUid,
            task,
            file
          })
          break
        default:
          this.$store.dispatch('facility/upload', {
            userUid: this.$store.getters.getUserUid,
            facilityId: task.id,
            file
          })
      }
    },*/
    onUploadImageByString({ file, task }, kind) {
      switch (kind) {
        case 'maintenance':
          this.$store.dispatch('maintenance/uploadByString', {
            userUid: this.$store.getters.getUserUid,
            task,
            file
          })
          break
        default:
          this.$store.dispatch('facility/uploadByString', {
            userUid: this.$store.getters.getUserUid,
            facilityId: task.id,
            file
          })
      }
    },
    onSkipUploadImage(id, kind) {
      switch (kind) {
        case 'maintenance':
          this.$store.dispatch('maintenance/skipUploadImage', id)
          break
        default:
          this.$store.dispatch('facility/skipUploadImage', id)
      }
    },
    showImageViewer(item) {
      this.currentItem = item
      this.imagesForViewer = item.data.images
      this.showImageDialog = true
    },
    addImage() {
      this.showImageDialog = false
      switch (this.showing) {
        case 'maintenance':
          this.$store.commit('maintenance/addNewRecord', this.currentItem)
          break
        default:
          this.$store.commit('facility/addNewRecord', this.currentItem)
      }
    }
  }
}
</script>
<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.custom-highlight-row {
  background-color: pink !important;
}
.table-row {
  transition: 0.1s;
}
.dial-button {
  transition: 0.1s;
}
.v-card {
  width: 100%;
}
.container {
  align-items: start;
}
.selected-text {
  position: absolute;
  top: -36px;
  font-size: 1.2rem;
  color: black;
  width: 100vw;
}
.v-bottom-navigation .v-btn .v-btn__content {
  opacity: 1 !important;
  color: white !important;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.2s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>
