<template>
  <div>
    <GistList :username="username" :token="token" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import GistList from './components/GistList.vue';

  export default defineComponent({
    name: 'App',
    components: {
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