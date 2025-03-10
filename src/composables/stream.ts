import {computed, ref} from "vue";
import {fixAndParseJSON} from "../utils/objectHelpers.ts";

export function useStream() {
    const textInput = ref<string>('')
    const streamText = ref<string>('')

    const parsedStreamText = computed<string>(() => streamText.value || "Ask me something and I will respond with stream")

    const sendChatStreamMessage = async (): Promise<void> => {
        if (streamText.value) streamText.value = ""

        const response = await fetch('http://localhost:3000/api/chatStream', {
            method: 'POST',
            body: JSON.stringify(textInput.value),
            headers: { 'Content-Type': 'application/json'}
        })

        if (!response.body || !response.ok) {
            streamText.value = 'Error: not possible to get the streamed response'
            console.error('No response body');
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            //@ts-ignore
            streamText.value += fixAndParseJSON(decoder.decode(value, { stream: true }))?.data?.choices?.[0]?.delta?.content || "";
            console.log(`Received chunk: ${streamText.value}`);
        }
    };

    return {
        textInput,
        parsedStreamText,
        sendChatStreamMessage,
    }
}