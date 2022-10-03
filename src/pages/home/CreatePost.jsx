import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addPostToFirebase } from "../../config/firebase";
import React from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function CreatePost(props) {
  const schema = yup
    .object()
    .shape({
      title: yup
        .string()
        .max(50, "Title must be 50 characters or less")
        .required("Title required"),
      description: yup
        .string()
        .max(300, "Description must be 300 characters or less")
        .required(),
      file: yup
        .mixed()
        .test("fileSize", "File must be under 3mb", (value) => {
          return value && value[0]?.size < 3000000;
        })
        .test("type", "File must be a valid image or video format", (value) => {
          if (value[0].type == "image/jpeg" || value[0].type == "video/mp4" || value[0].type == "image/png" || value[0].type == "image/jpg") {
            return value;
          }
        })
        .default(null),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const toastId = React.useRef(null);
  const notifyUploadingPost = () =>
    (toastId.current = toast.loading("Uploading Post..."));
  const notifyPostUploaded = () => {
    toast.dismiss(toastId.current);
    toast.success("Post Uploaded");
  };

  const onSubmit = async (data) => {
    notifyUploadingPost();
    const uploadedData = await addPostToFirebase(data);
    uploadedData ? notifyPostUploaded() : toast.error("Error");
    await props.getPosts()
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Title..." required {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}
        <input
          type="text"
          placeholder="Description..."
          required
          {...register("description")}
        />
        {errors.description && <p>{errors.description.message}</p>}
        <input type="file" required {...register("file")} />
        {errors.file && <p>{errors.file.message}</p>}
        <input type="submit" />
      </form>
      <ToastContainer />
    </div>
  );
}

export default CreatePost;
