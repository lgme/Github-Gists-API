<template>
  <VueSidePanel
		v-model="localOpened"
		lock-scroll
		side="bottom"
		height="500px"
  >
  <div v-if="loading" class="py-20 pl-8 pr-8 h-full flex flex-col justify-center">
      <div  class="border-t-transparent border-solid animate-spin rounded-full border-blue-500 border-4 h-8 w-8 m-auto"></div>
  </div>
  <div v-else class="py-20 pl-8 pr-8"><pre :class="languageClass"><code v-html="code"></code></pre></div>
  
  </VueSidePanel>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, watch } from "vue";
  import axios from 'axios';
  import Prism from 'prismjs';
  import 'prismjs/themes/prism.css';

  export default defineComponent({
    props: {
      opened: {
        type: Number,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        localOpened: this.opened,
        code: '',
        loading: false
      }
    },
    computed: {
      languageClass(): string {
        if (!this.url) return '';
        const startIndex = "https://gist.githubusercontent.com" . length;
        const remainingUrl = this.url.substring(startIndex);
        const lastDotIndex = remainingUrl.lastIndexOf('.');
        const extension = lastDotIndex === -1 ? '' : remainingUrl.substring(lastDotIndex + 1);
        return `language-${extension}`;
      }
    },
    watch: {
      opened(newValue) {
        this.localOpened = newValue
        this.loading = true;
      },
      url: {
        immediate: false,
        handler: async function(newUrl) {
          try {
            const response = await axios.get(newUrl);
            this.code = Prism.highlight(response.data, Prism.languages.markup, 'markup');
            this.loading = false;
          }
          catch (error) {
            console.error(error);
          }
        }
      }
    }
  })
</script>

