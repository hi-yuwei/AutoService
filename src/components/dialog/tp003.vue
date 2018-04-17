<template>
    <div>
        <div class="chart_left clearfix">
            <div class="content" @click="gameStart">
                tp003{{talk.resultTitle}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props:["talk","gameStart"],
    data() {
        return {};
    },
    beforeCreate() {},
    methods: {},
    mounted() {},
    created() {}
};
</script>
<style lang="scss">
    // @import "../../assets/talk";
</style>
