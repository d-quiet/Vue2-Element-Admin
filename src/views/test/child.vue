<template>
    <div>
        <p>{{ value }}</p>
        <button @click="add">num++</button>
    </div>
</template>

<script>
export default {
    // model: {
    //     prop: 'abc',
    //     event: 'cdf'
    // },
    props: ['value'],
    methods: {
        add() {
            let num = this.value
            this.$emit('input', ++num)
        }
    },
}
</script>

<style scoped>

</style>