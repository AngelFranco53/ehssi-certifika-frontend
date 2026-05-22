import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', {
    state: () => ({
        stack: [],
    }),
    actions: {
        set(error) {
            this.stack.push(error);
        },
        remove() {
            this.stack.pop();
        },
        clear() {
            this.stack = [];
        }
    }
})