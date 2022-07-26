<template>
  <div id="app">
    <router-view></router-view>
    <configPage @close="close" :configData="configData" v-if="configShow"></configPage>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from "electron"
@Component({
  components: {
    configPage: require('./components/config/config.vue').default
  }
})
export default class App extends Vue {
  configShow = false
  configData = {}
  created (): void {
    this.getDataSuccess()
  }

  getDataSuccess () {
    ipcRenderer.on('getDataSuccess', (_e: any, data: object) => {
      console.log(data, '<--- config配置数据')
      localStorage.setItem('config', JSON.stringify(data))
      this.configShow = true
      this.configData = data
    })
    ipcRenderer.on('getDataSuccess_', (_e: any, data: { title: string}) => {
      localStorage.setItem('config', JSON.stringify(data))
      this.configData = data
      document.title = data.title
    })
    ipcRenderer.send('getData')
  }

  close () {
    this.configShow = false
  }
}
</script>
<style>
  /* CSS */
  * {
    margin: 0;
    padding: 0;
  }
  html,body,#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

</style>
