<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Github Gists API"/> -->
  <div>
    <GistList :username="username" :token="token" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from './components/HelloWorld.vue';
import GistList from './components/GistList.vue';

export default defineComponent({
  name: 'App',
  components: {
    // HelloWorld,
    GistList
  },
  data() {
    return {
      username: '',
      token: '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'
    }
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
