<template>
    <div>
        11
        <Child v-model="num"></Child>
    </div>
</template>

<script>
import Child from './child.vue'
export default {
    data() {
        return {
            num: 0
        }
    },
    components: {
        Child
    }
}
</script>

<style scoped>

</style>