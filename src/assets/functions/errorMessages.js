export const mailError = (error) => {
  switch (error) {
    case "required":
      return "Email is required";
    case "maxLength":
      return "Email must contain less than 30 characters";
    default:
      return "Enter a valid email";
  }
};

export const passwordError = (password) => {
  if (password) {
    return "Password must contain at least 8 characters";
  } else {
    return "Password is required";
  }
};

export const nameError = (name) => {
  if (name) {
    return "Name must be less than 64 characters";
  } else {
    return "Name is required";
  }
};

export const blogTitleError = (title) => {
  if (title) {
    return "Title must contain less than 64 characters";
  } else {
    return "Title is required";
  }
};
export const blogDescriptionError = (title) => {
  if (title) {
    return "Description must contain less than 200 characters";
  } else {
    return "Description is required";
  }
};
