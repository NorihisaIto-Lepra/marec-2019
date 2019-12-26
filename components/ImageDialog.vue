<template>
  <v-dialog v-model="isActive" max-width="720px">
    <v-card>
      <DialogHeader color="black" :title="'画像'" @close="isActive = false" />
    </v-card>
    <imageViewer :images="images" @add="$emit('add')" />
  </v-dialog>
</template>

<script>
import imageViewer from './ImageViewer'

import DialogHeader from './DialogHeader'

export default {
  components: { DialogHeader, imageViewer },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    isActive: {
      get() {
        return this.$props.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  }
}
</script>
