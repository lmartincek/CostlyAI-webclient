<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:isChecked'])

const isChecked = ref<boolean>(false)

defineProps({
  name: {
    type: String,
    default: 'remember-me'
  }
})

function toggleCheck() {
  isChecked.value = !isChecked.value
  console.log(isChecked.value)
  emit('update:isChecked', isChecked.value)
}
</script>

<template>
  <div :class="['checkbox-wrapper', {'checked': isChecked}]"
       tabindex="0"
       @click.prevent="toggleCheck"
       @keydown.enter="toggleCheck"
  >
    <input :id="name" type="checkbox"/>
    <label class="cbx" :for="name"></label>
    <label class="lbl" :for="name"><slot /></label>
  </div>
</template>

<style scoped lang="scss">
.checkbox-wrapper input[type='checkbox'] {
  display: none;
  visibility: hidden;
}

.checkbox-wrapper label {
  display: inline-block;
}

.checkbox-wrapper .cbx {
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
.checkbox-wrapper .cbx:after {
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
.checkbox-wrapper .lbl {
  margin-left: 5px;
  vertical-align: middle;
  cursor: pointer;
}
.checkbox-wrapper.checked .cbx {
  border-color: transparent;
  background: $primary-gradient;
  animation: jelly 0.4s ease;
}
.checkbox-wrapper.checked .cbx:after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}
.checkbox-wrapper .cntr {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  text-align: center;
}
@-moz-keyframes jelly {
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
@-webkit-keyframes jelly {
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
@-o-keyframes jelly {
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
@keyframes jelly {
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
