import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import VuiBox from "../../../../components/admin/VuiBox";
import VuiTypography from "../../../../components/admin/VuiTypography";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseconfig";

function FormViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [users, setUsers] = useState([]);
  const [idMapping, setIdMapping] = useState({});

  const sanitizeImagePath = (path) => path.replace(/\\/g, "/");
  const getImageUrl = (path) => `${process.env.REACT_APP_BASE_URL}/${sanitizeImagePath(path)}`;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBackButtonClick = () => {
    navigate.push("/admin/products"); // Chuyển hướng về trang danh sách sản phẩm
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products"); 
        const productSnapshot = await getDocs(productsCollection);
        
        
        const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const mapping = {};
        productList.forEach((product, index) => {
          mapping[index + 1] = product.id;
        });
        setIdMapping(mapping);
      } catch (error) {
        console.error("Error fetching products:", error);
        setSnackbarMessage("Failed to fetch products.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users"); // Thay "users" bằng tên bảng của bạn
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
        console.log("Fetched users:", userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const realId = idMapping[id]; // Lấy ID thực từ mapping
      if (!realId) {
        setSnackbarMessage("Product not found.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      try {
        const productDoc = doc(db, "products", realId); // Thay "products" bằng tên bảng của bạn
        const productData = await getDoc(productDoc);
        if (productData.exists()) {
          setProduct(productData.data());
        } else {
          setSnackbarMessage("Product not found.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setSnackbarMessage("Failed to fetch product details.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(idMapping).length > 0) {
      fetchProductDetails();
    }
  }, [id, idMapping]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <VuiBox>
          <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            <VuiTypography>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress color="primary" size={60} />
                </Box>
              ) : product ? (
                <Paper elevation={3} style={{
                  padding: "24px",
                  borderRadius: "12px",
                  background: "linear-gradient(to bottom right, #19215c, #080d2d)"
                }}>
                  <Grid container>
                    <Grid item xs={6}>
                      {product.image && (
                        <img
                          src={getImageUrl(product.image)}
                          alt="product"
                          style={{
                            width: "400px",
                            maxHeight: "300px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                          }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <VuiTypography variant="h3" gutterBottom>
                        {product.title}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1" gutterBottom>
                        <strong>Product category: </strong> {product.categories_id}
                      </VuiTypography>
                      <VuiTypography variant="subtitle1">
                        <strong>Author: </strong> {users?.filter(u => product?.user_id === u.id)?.[0]?.name}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "30px" }}>
                      <VuiTypography variant="body1" paragraph>
                        <strong>Content: </strong>
                        <div dangerouslySetInnerHTML={{ __html: product.content }}></div>
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={3}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleBackButtonClick}
                        >
                          Back
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ) : (
                <VuiTypography variant="h5" color="text.secondary" align="center">
                  Loading product details...
                </VuiTypography>
              )}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default FormViewProduct;
