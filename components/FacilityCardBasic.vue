<template>
  <v-card>
    <DialogHeader
      color="facility darken-2"
      :title="isNew ? '新規設備登録' : '設備詳細情報／編集'"
      @close="$emit('close')"
    />
    <v-card
      class="pa-4 background"
      light
      flat
      tile
      style="padding-bottom: 60px !important"
    >
      <v-row justify="center" v-show="dataForPost.image">
        <v-col cols="auto">
          <v-img height="200" contain :src="dataForPost.image" />
        </v-col>
      </v-row>
      <v-text-field
        class="mx-2 mt-4 handwriting"
        label="名称"
        dense
        v-model="dataForPost.name"
      />
      <v-text-field
        class="mx-2 handwriting"
        label="設置場所"
        dense
        v-model="dataForPost.place"
      />
      <v-textarea
        v-model="dataForPost.memo"
        label="メモ"
        auto-grow
        outlined
        placeholder="保証書の場所など"
        :row-height="14"
        :rows="4"
      />
      <v-bottom-navigation
        color="white"
        grow
        background-color="primary"
        absolute
      >
        <v-btn :disabled="!canSave" @click="$emit('save', dataForPost)">
          <span>保存</span>
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn v-if="!isNew" :disabled="!canSave" @click="saveAndSelectImage">
          <span>保存して画像再選択</span>
          <v-icon>mdi-camera</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-card>
  </v-card>
</template>

<script>
import DialogHeader from './DialogHeader'
export default {
  components: { DialogHeader },
  props: {
    facility: {
      type: Object,
      default: {
        name: '',
        place: '',
        memo: '',
        image: '',
        created: null,
        modified: null
      }
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    canSave() {
      return Boolean(
        this.dataForPost.name.length && this.dataForPost.place.length
      )
    }
  },
  mounted() {
    if (this.$props.facility == null) return
    this.dataForPost.name = this.$props.facility.name || ''
    this.dataForPost.place = this.$props.facility.place || ''
    this.dataForPost.memo = this.$props.facility.memo || ''
    this.dataForPost.image = this.$props.facility.image || ''
    this.dataForPost.created = this.$props.facility.created || null
    this.dataForPost.modified = this.$props.facility.modified || null
  },
  data() {
    return {
      dataForPost: {
        name: '',
        place: '',
        memo: '',
        image: '',
        created: null,
        modified: null
      }
    }
  },
  methods: {
    saveAndSelectImage() {
      this.dataForPost.modified = null
      this.dataForPost.image = ''
      this.$emit('save', this.dataForPost)
    }
  }
}
</script>

<style></style>
