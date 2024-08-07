// import React, { useState } from "react";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import { useForm } from "react-hook-form";
// import { useHistory } from "react-router-dom";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import authorityDetailApi from "../../../apis/authorityDetailApi";
// import userApi from "../../../apis/userApi";

// function FormAddUserAuthory() {
//   const history = useHistory();
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (formData) => {
//     try {
//       // Check if email exists in userApi
//       const response = await authorityDetailApi.getUserByEmail(formData.email);
//       console.log(response);
//       const user = response;
      
//       if (user) {
//         // If user exists, add to authorityDetailApi
//         const addResponse = await authorityDetailApi.addUser(user);
//         console.log("User added successfully:", addResponse);
//         setSnackbarMessage("User added successfully.");
//         setSnackbarSeverity("success");
//         setSnackbarOpen(true);
//         setTimeout(() => history.push('/authorityDetail'), 1000); 
//       } else {
//         // If user does not exist, show error message
//         setSnackbarMessage("User with provided email does not exist.");
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//       }
//     } catch (error) {
//       console.error("Error adding user:", error);
//       setSnackbarMessage(error.response?.data?.message || "Failed to add user.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <div className="container">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div>
//             <label className="text-light form-label">Email</label>
//             <input
//               className="form-control bg-dark text-light"
//               {...register("email", {
//                 required: true,
//                 pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
//               })}
//             />
//             {errors.email && errors.email.type === "required" && (
//               <span className="text-danger">Email is required</span>
//             )}
//             {errors.email && errors.email.type === "pattern" && (
//               <span className="text-danger">Invalid email address</span>
//             )}
//           </div>
//           <div className="mt-3">
//             <button className="text-light btn btn-outline-info" type="submit">
//               Add User
//             </button>
//           </div>
//         </form>
//       </div>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//       <Footer />
//     </DashboardLayout>
//   );
// }

// export default FormAddUserAuthory;
