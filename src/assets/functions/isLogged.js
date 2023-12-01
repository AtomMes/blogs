export const logged = () => {
    return !!localStorage.getItem("user");
};
