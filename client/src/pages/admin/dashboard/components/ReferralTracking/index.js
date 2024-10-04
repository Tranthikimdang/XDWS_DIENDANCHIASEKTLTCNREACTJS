import React, { useEffect, useState } from "react";
import { Card, Stack, CircularProgress, Grid } from "@mui/material";
import moment from 'moment';
import VuiBox from "src/components/admin/VuiBox";
import VuiTypography from "src/components/admin/VuiTypography";
import colors from "src/assets/admin/theme/base/colors";
import { FaEllipsisH } from "react-icons/fa";
import linearGradient from "src/assets/admin/theme/functions/linearGradient";
// Import Firestore
import { collection, getDocs } from "firebase/firestore";
import { db } from "src/config/firebaseconfig"; 

const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
};

function ReferralTracking() {
  const { info, gradients } = colors;
  const { cardContent } = gradients;

  const [articles, setArticles] = useState([]);
  const [newArticles, setNewArticles] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const articleList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at: data.created_at && data.created_at.toDate ? data.created_at.toDate() : data.created_at,
          };
        });
        const newArticles = articleList.filter((a) =>
          moment(a.created_at).format("DD/MM/YYYY") === formatDate()
        );
        setNewArticles(newArticles);
        setArticles(articleList);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at: data.created_at && data.created_at.toDate ? data.created_at.toDate() : data.created_at,
          };
        });
        const newProducts = productList.filter((p) =>
          moment(p.created_at).format("DD/MM/YYYY") === formatDate()
        );
        setNewProducts(newProducts);
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const articleProgressValue = articles.length > 0 ? (newArticles.length / articles.length) * 100 : 0;
  const productProgressValue = products.length > 0 ? (newProducts.length / products.length) * 100 : 0;

  return (
    <Grid container spacing={2}>
      {/* Article Section */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            height: "100%",
            background: linearGradient(
              gradients.cardDark.main,
              gradients.cardDark.state,
              gradients.cardDark.deg
            ),
          }}
        >
          <VuiBox sx={{ width: "100%", padding: "20px" }}>
            <VuiBox
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
              mb="20px"
            >
              <VuiTypography variant="lg" color="white" mr="auto" fontWeight="bold">
                Thống kê bài viết
              </VuiTypography>
              <VuiBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgColor="#22234B"
                sx={{ width: "37px", height: "37px", cursor: "pointer", borderRadius: "12px" }}
              >
                <FaEllipsisH color={info.main} size="18px" />
              </VuiBox>
            </VuiBox>

            <Stack
              direction="column"
              spacing="20px"
              sx={{ width: "100%" }}
            >
              <VuiBox
                display="flex"
                p="20px 22px"
                flexDirection="column"
                sx={{
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  borderRadius: "20px",
                }}
              >
                <VuiTypography color="text" variant="button" fontWeight="regular" mb="5px">
                  Bài viết mới
                </VuiTypography>
                <VuiTypography color="white" variant="lg" fontWeight="bold">
                  {newArticles.length}
                </VuiTypography>
              </VuiBox>

              <VuiBox
                display="flex"
                p="20px 22px"
                flexDirection="column"
                sx={{
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  borderRadius: "20px",
                }}
              >
                <VuiTypography color="text" variant="button" fontWeight="regular" mb="5px">
                  Tổng số bài viết
                </VuiTypography>
                <VuiTypography color="white" variant="lg" fontWeight="bold">
                  {articles.length}
                </VuiTypography>
              </VuiBox>

              <VuiBox sx={{ position: "relative", display: "inline-flex", marginTop: "20px" }}>
                <CircularProgress
                  variant="determinate"
                  value={articleProgressValue}
                  size={150}
                  color="success"
                />
                <VuiBox
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VuiBox display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <VuiTypography color="white" variant="d5" fontWeight="bold" mb="4px">
                      {(articleProgressValue / 10).toFixed(1)}
                    </VuiTypography>
                    <VuiTypography color="text" variant="button">
                      Tổng bài viết
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
              </VuiBox>
            </Stack>
          </VuiBox>
        </Card>
      </Grid>

      {/* Product Section */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            height: "100%",
            background: linearGradient(
              gradients.cardDark.main,
              gradients.cardDark.state,
              gradients.cardDark.deg
            ),
          }}
        >
          <VuiBox sx={{ width: "100%", padding: "20px" }}>
            <VuiBox
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
              mb="20px"
            >
              <VuiTypography variant="lg" color="white" mr="auto" fontWeight="bold">
                Thống kê sản phẩm
              </VuiTypography>
              <VuiBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgColor="#22234B"
                sx={{ width: "37px", height: "37px", cursor: "pointer", borderRadius: "12px" }}
              >
                <FaEllipsisH color={info.main} size="18px" />
              </VuiBox>
            </VuiBox>

            <Stack
              direction="column"
              spacing="20px"
              sx={{ width: "100%" }}
            >
              <VuiBox
                display="flex"
                p="20px 22px"
                flexDirection="column"
                sx={{
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  borderRadius: "20px",
                }}
              >
                <VuiTypography color="text" variant="button" fontWeight="regular" mb="5px">
                  Sản phẩm mới
                </VuiTypography>
                <VuiTypography color="white" variant="lg" fontWeight="bold">
                  {newProducts.length}
                </VuiTypography>
              </VuiBox>

              <VuiBox
                display="flex"
                p="20px 22px"
                flexDirection="column"
                sx={{
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  borderRadius: "20px",
                }}
              >
                <VuiTypography color="text" variant="button" fontWeight="regular" mb="5px">
                  Tổng số sản phẩm
                </VuiTypography>
                <VuiTypography color="white" variant="lg" fontWeight="bold">
                  {products.length}
                </VuiTypography>
              </VuiBox>

              <VuiBox sx={{ position: "relative", display: "inline-flex", marginTop: "20px" }}>
                <CircularProgress
                  variant="determinate"
                  value={productProgressValue}
                  size={150}
                  color="success"
                />
                <VuiBox
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    // alignItems="center",
                    // justifyContent="center",
                  }}
                >
                  <VuiBox display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <VuiTypography color="white" variant="d5" fontWeight="bold" mb="4px">
                      {(productProgressValue / 10).toFixed(1)}
                    </VuiTypography>
                    <VuiTypography color="text" variant="button">
                      Tổng sản phẩm
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
              </VuiBox>
            </Stack>
          </VuiBox>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ReferralTracking;