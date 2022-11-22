<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  name: 'App',
  created() {
    // Axios('itcast/nc/article/headline/T1348647853363/0-40.html').then((data) => {
    //   console.log(data)
    // })
  },
}
</script>
