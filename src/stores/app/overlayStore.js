import { defineStore } from 'pinia'

export const useOverlayStore = defineStore('overlay', {
    state: () => ({
        stack: [],
    }),
    getters: {
        isLoading: (state) => !!state.stack.length,
    },
    actions: {
        pop() {
            this.$state.stack.pop();
        },
        push() {
            if(this.$state.show) {
                this.$state.stack.push('1');
            }
            this.$state.show = true
        }
    }
})