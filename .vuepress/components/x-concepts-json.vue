<template>
  <div class="center">
    <vue-typer
      :text="[
        'json',
        'rest-api',
        'oop',
        'ui',
        'routing',
        'documentation',
        'deployment',
      ]"
    ></vue-typer
    >.concepts.json
  </div>
</template>

<style scoped>
.center {
  text-align: center;
}
</style>

<script>
import { VueTyper } from "vue-typer";

export default {
  components: {
    VueTyper,
  },
};
</script>