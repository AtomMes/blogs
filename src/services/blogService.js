import axios from "axios";

const blogClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

blogClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      window.location.href = "/network-issue";
    } else {
      window.location.href = "/404";
    }
  }
);

export default {
  create(blog) {
    return blogClient.post("/blogs", blog);
  },
  getBlogs() {
    return blogClient.get("/blogs");
  },
  deleteBlog(id) {
    return blogClient.delete("/blogs/" + id);
  },
  searchBlog(text) {
    return blogClient.get("/blogs?q=" + text);
  },
  getById(id) {
    return blogClient.get("/blogs?id=" + id);
  },
  getByAuthorId(id) {
    return blogClient.get("/blogs?authorId=" + id);
  },
  isLiked(id) {
    return blogClient.get("/likes?id=" + id);
  },
  like(ids) {
    return blogClient.post("/likes", ids);
  },
  removeLike(id) {
    return blogClient.delete("/likes/" + id);
  },
  getBlogLikes(id) {
    return blogClient.get("/likes?blogId=" + id);
  },
  addComment(comment) {
    return blogClient.post("/comments", comment);
  },
  getBlogComments(id) {
    return blogClient.get("/comments?blogId=" + id);
  },
  updateBlog (id, newData) {
    return blogClient.patch('/blogs/' + id, newData);
  },
};
