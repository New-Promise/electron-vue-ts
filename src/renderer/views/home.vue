<template>
    <div class="homePage">
        <iframe allow="geolocation; microphone; camera;"
                id="view" ref="view" v-if="isIframe" :src="iframeUrl"></iframe>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {
  iframeUrl = ''
  isIframe = false

  created(): void {
    this.getConfigData()
  }

  getConfigData (): void {
    const config = localStorage.getItem('config')
    if (!config) {
      setTimeout(() => this.getConfigData(), 300)
    } else {
      this.iframeUrl = JSON.parse(config).url + '?timestamp=' + new Date().getTime()
      this.isIframe = true
    }
  }
}
</script>

<style scoped lang="less">
.homePage {
    width: 100%;
    height: 100%;
    #view {
        width: 100%;
        height: 100%;
    }
}
</style>
