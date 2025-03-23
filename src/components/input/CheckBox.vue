<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:isChecked'])

const isChecked = ref<boolean>(false)

function toggleCheck() {
  isChecked.value = !isChecked.value
  emit('update:isChecked', isChecked.value)
}
</script>

<template>
  <div class="checkbox-wrapper-42">
    <input id="cbx-42" type="checkbox" @click="toggleCheck" />
    <label class="cbx" for="cbx-42"></label>
    <label class="lbl" for="cbx-42"><slot /></label>
  </div>
</template>

<style scoped lang="scss">
.checkbox-wrapper-42 input[type='checkbox'] {
  display: none;
  visibility: hidden;
}

.checkbox-wrapper-42 label {
  display: inline-block;
}

.checkbox-wrapper-42 .cbx {
  position: relative;
  top: 1px;
  width: 17px;
  height: 17px;
  border: 1px solid $border-color;
  border-radius: 3px;
  vertical-align: middle;
  transition: background 0.1s ease;
  cursor: pointer;
}
.checkbox-wrapper-42 .cbx:after {
  content: '';
  position: absolute;
  top: 0;
  left: 5px;
  width: 4px;
  height: 9px;
  opacity: 0;
  transform: rotate(45deg) scale(0);
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transition: all 0.3s ease;
  transition-delay: 0.1s;
}
.checkbox-wrapper-42 .lbl {
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
}
.checkbox-wrapper-42 input[type='checkbox']:checked ~ .cbx {
  border-color: transparent;
  background: $primary-gradient;
  animation: jelly-42 0.4s ease;
}
.checkbox-wrapper-42 input[type='checkbox']:checked ~ .cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}
.checkbox-wrapper-42 .cntr {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
}
@-moz-keyframes jelly-42 {
  from {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}
@-webkit-keyframes jelly-42 {
  from {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}
@-o-keyframes jelly-42 {
  from {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}
@keyframes jelly-42 {
  from {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}
</style>
