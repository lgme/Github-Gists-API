<template>
  <VueSidePanel
		v-model="isOpened"
		lock-scroll
		side="right"
		width="600px"
  >
    <div class="py-20 pl-8 pr-8">
      This is scrolled body!
    </div>
  </VueSidePanel>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, watch } from "vue";

  export default defineComponent({
    props: {
      isOpenedProp: {
        type: Boolean as PropType<boolean>,
        required: true
      }
    },
    setup(props) {
      const isOpened = ref(props.isOpenedProp);

      // Watch for changes to isOpened prop and update local ref
      watch(() => props.isOpenedProp, (newVal, oldVal) => {
        if (newVal !== oldVal) {
          isOpened.value = true
        }
      });

      return {
        isOpened
      }
    }
  })
</script>

