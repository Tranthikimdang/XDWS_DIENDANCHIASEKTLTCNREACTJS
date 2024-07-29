import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

function FormAunouncement() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const content = watch("content");

  return (
    
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="text-light form-label">Sender</label>
            <input
              className="form-control bg-dark text-light"
              {...register("sender", { required: "Sender is required" })}
            />
            {errors.sender && <span className="text-danger">{errors.sender.message}</span>}
          </div>
          <div className="mb-3">
            <label className="text-light form-label">Receiver</label>
            <input
              className="form-control bg-dark text-light"
              {...register("receiver", { required: "Receiver is required" })}
            />
            {errors.receiver && <span className="text-danger">{errors.receiver.message}</span>}
          </div>

          <div className="mb-3">
            <label className="text-light form-label">Status</label>
            <select
              className="form-control bg-dark text-light"
              {...register("status", { required: "Status is required" })}
            >
              <option value="">Select status</option>
              <option value="đã gửi">Đã gửi</option>
              <option value="nháp">Nháp</option>
            </select>
            {errors.status && <span className="text-danger">{errors.status.message}</span>}
          </div>
          <div className="mb-3">
            <label className="text-light form-label">Created Date</label>
            <input
              className="form-control bg-dark text-light"
              type="date"
              {...register("created_date", { required: "Created Date is required" })}
            />
            {errors.created_date && (
              <span className="text-danger">{errors.created_date.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="text-light form-label">Content</label>
            <Editor
              apiKey="owarvk3rl1z5v44dvx9b06crntnsgrgjcja6mayprjqj5qaa"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                tinycomments_mode: "embedded",
                content_css: false, 
                body_class: 'my-editor', 
                tinycomments_author: "Author name",
                mergetags_list: [
                  { value: "First.Name", title: "First Name" },
                  { value: "Email", title: "Email" },
                ],
                ai_request: (request, respondWith) =>
                  respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
              }}
              initialValue="d"
            />
            {errors.content && <span className="text-danger">{errors.content.message}</span>}
          </div>
          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default FormAunouncement;
