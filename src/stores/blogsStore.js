import { ref } from "vue";
import { defineStore } from "pinia";

export const useBlogStore = defineStore("blog", () => {
    const blog = ref({
        name: null,
        email: null,
        id: null,
    });
    const useBlog = blog.value;

    function setBlog(newBlog) {
        useBlog.name = newBlog.name;
        useBlog.email = newBlog.email;
        useBlog.id = newBlog.id;
    }

    return { blog, setBlog };
});
