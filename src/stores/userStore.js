import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
    const user = ref({
        name: null,
        email: null,
        img: null,
        id: null,
    });
    const useUser = user.value;

    function setUser(newUser) {
        useUser.name = newUser.name;
        useUser.email = newUser.email;
        useUser.id = newUser.id;
        useUser.img = newUser.img;
    }

    function logOut() {
        useUser.name = null;
        useUser.email = null;
        useUser.id = null;
        useUser.img = null;
    }

    return { user, setUser, logOut };
});
