<template>
  <v-card v-if="$props.task.length > 0">
    <DialogHeader
      :color="color"
      title="画像選択（設備）"
      disableClose
      @close="onSkip"
    />
    <v-card
      v-if="!showPhotoCard"
      class="pa-4"
      style="padding-bottom: 72px !important"
      color="background"
      flat
      light
      tile
      min-height="60vh"
    >
      <v-text-field
        label="設備名"
        class="mb-2"
        readonly
        outlined
        dense
        hide-details
        :value="currentTask.data.name"
      />
      <v-text-field
        label="記録日時"
        readonly
        outlined
        dense
        hide-details
        :value="
          currentTask.data.created != null
            ? $dayjs(currentTask.data.created.toDate()).format(
                'YYYY年MM月DD日 HH:mm:ss'
              )
            : ''
        "
      />
      <div>
        <span>※写真は後からでも追加できます。</span>
      </div>
      <div v-if="$props.task.length > 1">
        <span>
          これを含めあと{{ $props.task.length }}個新規データがあります
        </span>
      </div>

      <v-bottom-navigation
        :input-value="!showPhotoCard"
        color="white"
        grow
        background-color="primary"
        absolute
      >
        <v-btn @click="onClickSelect">
          選択<v-icon>mdi-cloud-upload</v-icon>
        </v-btn>
        <v-btn @click="onClickPhoto"> 撮影<v-icon>mdi-camera</v-icon> </v-btn>
        <v-btn @click="onSkip"> 完了<v-icon right>mdi-check</v-icon> </v-btn>
      </v-bottom-navigation>
      <v-layout row wrap>
        <div
          class="ma-4"
          v-for="(url, index) in currentTask.data.images"
          :key="index"
        >
          <img :src="url" class="preview" />
        </div>
      </v-layout>
    </v-card>
    <PhotoCard
      v-if="showPhotoCard"
      @send="sendPhoto"
      @exit="showPhotoCard = false"
    />
    <input
      style="display: none"
      ref="inputFile"
      type="file"
      accept="image/jpeg, image/jpg, image/png"
      @change="onImagePicked"
    />
  </v-card>
</template>

<script>
import DialogHeader from './DialogHeader'
import PhotoCard from './PhotoCard'
export default {
  components: { DialogHeader, PhotoCard },
  props: {
    task: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: 'facility'
    }
  },
  data() {
    return {
      showPhotoCard: false
    }
  },
  computed: {
    currentTask() {
      return this.$props.task[0]
    }
  },
  methods: {
    onImagePicked(e) {
      const file = e.target.files[0]
      if (file == null) return
      //圧縮してから送信
      const image = new Image()
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = e => {
        image.src = e.target.result
        image.onload = () => {
          this.$emit('uploadByString', {
            task: this.currentTask,
            file: this.width < 720 ? this.src : this.makeImage(image)
          })
        }
      }
    },
    makeImage(image) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const ratio = image.height / image.width
      const width = 720
      const height = width * ratio
      canvas.width = width
      canvas.height = height
      ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)
      return canvas.toDataURL('image/jpeg')
    },
    onSkip() {
      this.$emit('skip', this.currentTask.id)
    },
    onClickSelect() {
      this.$refs.inputFile.click()
    },
    onClickPhoto() {
      this.showPhotoCard = true
    },
    sendPhoto(e) {
      this.$emit('uploadByString', {
        task: this.currentTask,
        file: e
      })
    }
  }
}
</script>
