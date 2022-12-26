<template>
    <div>
        {{ num }}
    </div>
</template>

<script>
export default {
    props: ['num'],
    methods: {
        getNum() {
            console.log(this.num)
        }
    },
}
</script>

<style scoped>

</style>