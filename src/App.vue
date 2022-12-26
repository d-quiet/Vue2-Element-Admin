<template>
  <div id="app">
    <!-- <elTest></elTest> -->
    <router-view />
    <!-- <Permission></Permission> -->
    <!-- <Slot1>
      <template #head="{ list }">
        <h2>头部{{ list }}</h2>
      </template>
      <template #footer="{ a }">
        <h2>底部{{ a }}</h2>
      </template>
    </Slot1> -->
    <!-- <Child ref="child" :num="num"></Child> -->
    <!-- <button @click="addNum">num执行了</button> -->
  </div>
</template>

<script>
import Slot1 from './views/Slot.vue'
import Axios from 'axios'
import Child from './Child.vue'
import Permission from './Permission.vue'
export default {
  name: 'App',
  components: {
    // Slot1
    // Child
    // elTest
    // Permission
  },
  data() {
    return {
      num: 0
    }
  },

  created() {
    // Axios('itcast/nc/article/headline/T1348647853363/0-40.html').then((data) => {
    //   console.log(data)
    // })
  },
  methods: {
    addNum() {
      this.num = 11000
      console.log(this.$refs.child.num)
      this.$nextTick(() => {
        console.log(this.$refs.child.num)
      })
    }
  }
}
</script>
