import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Pagination
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
// Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import './index.css';

const Products = () => {
  const navigate = useNavigate();
  const [cates, setCates] = useState([]);
  const [catesMap, setCatesMap] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
        console.log('Fetched products:', productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories_product'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCates(categoriesData);

        const categoriesMap = categoriesData.reduce((map, category) => {
          map[category.id] = category.name;
          return map;
        }, {});
        setCatesMap(categoriesMap);
        console.log('Fetched categories:', categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <PageContainer title="products" description="This is products">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              Các khóa học của chúng tôi
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              A collection of products sharing experiences of self-learning programming online and
              web development techniques.
            </Typography>
          </Grid>

          {/* Left Column */}
          <Grid item md={8}>

          </Grid>

          {/* Right Column */}
          <Grid item md={4}>

          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Products;
