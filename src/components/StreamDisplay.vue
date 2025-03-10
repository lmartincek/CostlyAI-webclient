<script setup>
import ButtonBasic from "./ButtonBasic.vue";
import {useStream} from "../composables/stream.ts";

const stream = useStream()
</script>

<template>
  <div class="wrapper-stream">
    <div class="wrapper-stream__controls">
        <input placeholder="Ask a question to get a streamed response"
               @keydown.enter="stream.sendChatStreamMessage()"
               v-model="stream.textInput.value"/>
        <ButtonBasic :disabled="!stream.textInput.value"
                     @click="stream.sendChatStreamMessage()">Ask</ButtonBasic>
    </div>

    <div class="wrapper-stream__output">
        <p>{{stream.parsedStreamText}}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper-stream {
    width: 100%;
    background: black;
    border-radius: 1rem;
    margin: 3rem 0 1rem;

    &__controls {
        display: flex;
        padding: 1rem 1rem 0 1rem;

        input {
            border-radius: .5rem;
            padding: 0.5rem 1rem;
            margin-right: 1rem;
            background: #ffffff;
            color: #000000;
            width: 100%;
        }
    }

    &__output {
        text-align: left;
        display: flex;
        padding: 0 1.25rem 0;
    }
}
</style>
