<template>
  <div>
    <div>子组件:{{ id }}</div>
  </div>
</template>

<script>
export default {
  props: ["id"],
  watch: {
    id(new1, old2) {
      console.log(this)
      console.log('====================================');
      console.log(new1);
      console.log(old2);
      console.log('====================================');
    }
  },
  name: "",
  data() {
    return {

    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped>

</style>