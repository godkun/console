import { defineStore } from "pinia";
import persistedstate from "pinia-plugin-persistedstate";

export default (context, inject: Function): void => {
  context.$pinia.use(persistedstate);
  const useStore = defineStore({
    id: "store",
    state: () => ({
      collapse: false,
    }),
    actions: {
      toogleCollpase() {
        this.collapse = !this.collapse;
      },
    },
  });
  inject("useStore", useStore);
  context.useStore = useStore;
};
