<template>
    <div>
        <!-- 具名插槽 -->
        <slot name="head" :list="list"></slot>
        <slot name="footer" :a="a"></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [1, 2, 3, 4, 5],
            a: 222
        }
    }
}
</script>

<style scoped>

</style>