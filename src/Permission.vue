<template>
    <div>
        <p v-permission="['admin',]">admin可以看到</p>
        <p v-permission="['editor']">editor可以蛋刀</p>
        <p v-permission="['admin', 'editor', 'viewer']">都可以看到</p>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>