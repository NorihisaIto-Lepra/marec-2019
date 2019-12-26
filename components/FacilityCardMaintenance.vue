<template>
  <v-card>
    <DialogHeader
      color="maintenance darken-2"
      title="整備"
      @close="$emit('close')"
    />
    <v-card
      class="pa-4 background"
      light
      flat
      tile
      style="padding-bottom: 60px !important"
    >
      整備した記録を保存します。
      <v-text-field placeholder="memo" v-model="memo" />
      <v-bottom-navigation
        color="white"
        grow
        background-color="primary"
        absolute
      >
        <v-btn @click="onClickOk(false)">
          <span>写真無しで記録</span>
          <v-icon>mdi-camera-off</v-icon>
        </v-btn>
        <v-btn @click="onClickOk(true)">
          <span>写真有りで記録</span>
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
  data() {
    return {
      memo: ''
    }
  },
  methods: {
    onClickOk(photo) {
      this.$emit('ok', { photo, memo: this.memo })
    }
  }
}
</script>
