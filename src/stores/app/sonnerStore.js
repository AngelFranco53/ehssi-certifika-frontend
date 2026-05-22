import { defineStore } from "pinia";

export const useSonnerStore = defineStore("sonner", {
    state: () => ({
        stack: [],
    }),
    actions: {
        push(title, message, type = 'info') {
            this.stack.push({ title, message, color: type });
        },
        pop() {
            this.stack.pop();
        },
        clear() {
            this.stack = [];
        }   
    }
})