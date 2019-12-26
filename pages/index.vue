<template>
  <div class="container" light>
    <v-row justify="center" dense>
      <v-col cols="12" sm="8" md="4">
        <img src="/icon.png" class="ma-2 login" />
        <h3 class="primary">～お部屋のお薬手帳～</h3>
        <img src="/btn_google_signin.png" @click="login" class="ma-5 login" />
      </v-col>
    </v-row>
    <v-footer fixed app class="primary darken-2">
      2018上期レプラボアイデア部門
    </v-footer>
  </div>
</template>

<script>
export default {
  methods: {
    async login() {
      await this.$store.dispatch('login')
      this.$router.push('/facility')
    }
  }
}
</script>
<style>
.container {
  margin: 0 auto;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.login {
  cursor: pointer;
  width: 50%;
  max-width: 300px;
  min-width: 200px;
}
</style>
