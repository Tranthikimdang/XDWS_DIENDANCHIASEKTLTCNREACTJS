/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Stack, CircularProgress, Grid } from '@mui/material';
import moment from 'moment';
import VuiBox from 'src/components/admin/VuiBox';
import VuiTypography from 'src/components/admin/VuiTypography';
import colors from 'src/assets/admin/theme/base/colors';
import { FaEllipsisH } from 'react-icons/fa';
import linearGradient from 'src/assets/admin/theme/functions/linearGradient';
// Import Firestore
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'src/config/firebaseconfig';
import apis from 'src/apis/CourseApI';

const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

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
        const querySnapshot = await getDocs(collection(db, 'articles'));
        const articleList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at:
              data.created_at && data.created_at.toDate
                ? data.created_at.toDate()
                : data.created_at,
          };
        });
        const newArticles = articleList.filter(
          (a) => moment(a.created_at).format('DD/MM/YYYY') === formatDate(),
        );
        setNewArticles(newArticles);
        setArticles(articleList);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('abcd');

        const res = await apis.getCoursesList();
        console.log(res);
        if (res?.status == 'success') {
          const { courses } = res?.data;
          const newProducts = courses?.filter(
            (p) => moment.utc(p.created_at).format('DD/MM/YYYY') === formatDate(),
          );
          setProducts(courses);
          setNewProducts(newProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const articleProgressValue =
    articles.length > 0 ? (newArticles.length / articles.length) * 100 : 0;
  const productProgressValue =
    products.length > 0 ? (newProducts.length / products.length) * 100 : 0;

  return (
    <Grid container spacing={2}>
      {/* Product Section */}
      <Card
        sx={{
          height: '100%',
          background: linearGradient(gradients.cardDark.main, gradients.cardDark.state, gradients.cardDark.deg)
        }}>
        <VuiBox sx={{ width: '100%' }}>
          <VuiBox
            display='flex'
            alignItems='center'
            justifyContent='space-beetween'
            sx={{ width: '100%' }}
            mb='40px'>
            <VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
              Thống kê khóa học
            </VuiTypography>
            <VuiBox
              display='flex'
              justifyContent='center'
              alignItems='center'
              bgColor='#22234B'
              sx={{ width: '37px', height: '37px', cursor: 'pointer', borderRadius: '12px' }}>
              <FaEllipsisH color={info.main} size='18px' />
            </VuiBox>
          </VuiBox>
          <VuiBox
            display='flex'
            sx={({ breakpoints }) => ({
              [breakpoints.up('xs')]: {
                flexDirection: 'column',
                gap: '16px',
                justifyContent: 'center',
                alignItems: 'center'
              },
              [breakpoints.up('md')]: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }
            })}>
            <Stack direction="column" spacing="20px" sx={{ width: '100%' }}>
              <VuiBox
                display="flex"
                p="20px 22px"
                flexDirection="row"
                sx={{
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  borderRadius: '20px',
                  alignItems: 'center',
                }}
              >
                <VuiTypography color="text" variant="button" fontWeight="regular" mr="5px">
                  Khóa học mới
                </VuiTypography>
                <VuiTypography color="white" variant="lg" fontWeight="bold">
                  {newProducts.length}
                </VuiTypography>
              </VuiBox>

              <VuiBox
                display="flex"
                p="20px 22px"
                flexDirection="row"
                sx={{
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  borderRadius: '20px',
                  alignItems: 'center',
                }}
              >
                <VuiTypography color="text" variant="button" fontWeight="regular" mr="5px">
                  Tổng số khóa học 
                </VuiTypography>
                <VuiTypography color="white" variant="lg" fontWeight="bold">
                  {products.length}
                </VuiTypography>
              </VuiBox>
            </Stack>
            <VuiBox sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant='determinate'
                value={70}
                size={window.innerWidth >= 1024 ? 200 : window.innerWidth >= 768 ? 170 : 200}
                color='success'
              />
              <VuiBox
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <VuiBox display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <VuiTypography color='text' variant='button' mb='4px'>
                    Safety
                  </VuiTypography>
                  <VuiTypography
                    color='white'
                    variant='d5'
                    fontWeight='bold'
                    mb='4px'
                    sx={({ breakpoints }) => ({
                      [breakpoints.only('xl')]: {
                        fontSize: '32px'
                      }
                    })}>
                    9.3
                  </VuiTypography>
                  <VuiTypography color='text' variant='button'>
                    Total Score
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      </Card>
    </Grid>
  );
}

export default ReferralTracking;
