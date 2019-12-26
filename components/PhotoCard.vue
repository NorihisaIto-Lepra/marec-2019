<template>
  <v-card class="pa-2" flat color="blue-grey" height="60vh">
    <v-layout v-show="img == null" justify-center>
      <template>
        <video
          :srcObject.prop="stream"
          ref="video"
          id="video"
          :width="imageWidth"
          autoplay
        />
        <canvas
          ref="canvas"
          id="canvas"
          :width="imageWidth"
          :height="canvasHeight"
        />
      </template>
    </v-layout>
    <v-layout v-show="img != null" justify-center>
      <img :src="img" />
    </v-layout>
    <v-bottom-navigation color="white" grow background-color="grey" absolute>
      <template v-if="img != null">
        <v-btn @click="img = null">撮り直し<v-icon>mdi-undo</v-icon></v-btn>
        <v-btn @click="emitImg">送信<v-icon>mdi-cloud-upload</v-icon> </v-btn>
        <v-btn @click="exit">撮影中止<v-icon>mdi-close</v-icon> </v-btn>
      </template>
      <template v-else>
        <v-btn @click="capture">撮影<v-icon>mdi-camera</v-icon> </v-btn>
        <v-btn @click="exit">撮影中止<v-icon>mdi-close</v-icon> </v-btn>
      </template>
    </v-bottom-navigation>
  </v-card>
</template>

<script>
const constraints = {
  audio: false,
  video: { facingMode: 'environment' }
}

export default {
  data() {
    return {
      stream: null,
      video: null,
      canvas: {},
      img: null,
      canvasHeight: 500
    }
  },
  async mounted() {
    this.video = this.$refs.video
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
    }
  },
  methods: {
    capture() {
      this.canvasHeight = this.video.clientHeight
      this.$nextTick(() => {
        this.canvas = this.$refs.canvas
        this.canvas
          .getContext('2d')
          .drawImage(
            this.video,
            0,
            0,
            this.video.clientWidth,
            this.video.clientHeight
          )

        this.img = this.canvas.toDataURL('image/jpeg', 0.75)
        // toBlobできたら楽だけどどうもiOSで上手く行かないので
      })
    },
    emitImg() {
      this.stopTracks()
      this.$emit('send', this.img)
    },
    exit() {
      this.stopTracks()
      this.$emit('exit')
    },
    stopTracks() {
      if (this.stream == null) return
      this.stream.getVideoTracks().forEach(track => {
        track.stop()
      })
    }
  },
  beforeDestroy() {
    this.stopTracks()
  },
  computed: {
    imageWidth() {
      return window.innerWidth > 720 ? 432 : window.innerWidth
    },
    imageHeight() {
      return window.innerHeight
    }
  }
}
</script>

<style>
#canvas {
  display: none;
}
.capture {
  /* display: inline; */
  padding: 5px;
}
video {
  object-fit: contain;
}
</style>
