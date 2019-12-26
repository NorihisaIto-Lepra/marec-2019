<template>
  <v-card>
    <DialogHeader color="grey" title="削除" @close="$emit('close')" />
    <v-layout column justify-center>
      <span class="ma-4">
        削除します。よろしいですか？
      </span>
      <v-btn @click="$emit('ok')">
        削除
        <v-icon right>mdi-delete</v-icon>
      </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import DialogHeader from './DialogHeader'
export default {
  components: { DialogHeader }
}
</script>
