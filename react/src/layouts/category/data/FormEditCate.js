import React, { useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import api from "../../../apis/categoriesApi";

function FormEditCate() {
  const location = useLocation();
  const { data } = location.state || {};

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data?.name || "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
    }
  }, [data, setValue]);

  const onSubmit = async (formData) => {
    try {
      const response = await api.updateCategory(data.id, formData);
      console.log("Category updated successfully:", response);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-light form-label">Category name</label>
            <input
              className="form-control bg-dark text-light"
              {...register("name", { required: true, minLength: 3, maxLength: 20 })}
            />
            {errors.name && errors.name.type === "required" && (
              <span className="text-danger">Name is required</span>
            )}
            {errors.name && errors.name.type === "minLength" && (
              <span className="text-danger">Name must be at least 3 characters long</span>
            )}
            {errors.name && errors.name.type === "maxLength" && (
              <span className="text-danger">Name must be less than 20 characters long</span>
            )}
          </div>
          <div className="mt-3">
            <button className="text-light btn btn-outline-info" type="submit">
              Edit
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default FormEditCate;
