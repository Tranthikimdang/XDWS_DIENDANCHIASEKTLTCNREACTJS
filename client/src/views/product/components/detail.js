import React, { useEffect, useState } from 'react';
import { IconBracketsContainStart } from '@tabler/icons';
import {
  Grid,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { IconBookmark, IconDots } from '@tabler/icons';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FlagIcon from '@mui/icons-material/Flag';
import { formatDistanceToNow } from 'date-fns';
//firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebaseconfig';
import './detail.css';

const ProductsDetail = () => {
  const navigate = useNavigate();
  const [cates, setCates] = useState([]);
  const [catesMap, setCatesMap] = useState({}); // State to store category ID to name mapping
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

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
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchProducts();
  }, []);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'products'));
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        console.log('Fetched users:', usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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

        // Create a mapping of category ID to name
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

  const menuItems = [
    { icon: <FacebookIcon />, text: 'Share on Facebook' },
    { icon: <TwitterIcon />, text: 'Share on Twitter' },
    { icon: <EmailIcon />, text: 'Share via Email' },
    { icon: <LinkIcon />, text: 'Copy Link' },
    { icon: <FlagIcon />, text: 'Report products' },
  ];

  const removeSpecificHtmlTags = (html, tag) => {
    const regex = new RegExp(`<${tag}[^>]*>|</${tag}>`, 'gi');
    return html?.replace(regex, '');
  };

  // Helper function to format date as "1 hour ago", "2 days ago", etc.
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <PageContainer title="products" description="This is products">
      <Box sx={{ padding: { xs: '10px' } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ marginBottom: { xs: '50px', md: '50px' }, marginTop: '30px' }}>
            <Typography variant="h4" component="h1" className="heading">
              Featured products
            </Typography>
            <Typography variant="body1" paragraph className="typography-body">
              A collection of products sharing experiences of self-learning programming online and
              web development techniques.
            </Typography>
          </Grid>

          {/* Left Column */}
          <Grid item md={8}>
            <div class="container">
              <div class="card">
                <div class="container-fliud">
                  <div class="wrapper row">
                    <div class="preview col-md-6">
                      <div class="preview-pic tab-content">
                        <div class="tab-pane active" id="pic-1">
                          <img src="http://placekitten.com/400/252" />
                        </div>
                        <div class="tab-pane" id="pic-2">
                          <img src="http://placekitten.com/400/252" />
                        </div>
                        <div class="tab-pane" id="pic-3">
                          <img src="http://placekitten.com/400/252" />
                        </div>
                        <div class="tab-pane" id="pic-4">
                          <img src="http://placekitten.com/400/252" />
                        </div>
                        <div class="tab-pane" id="pic-5">
                          <img src="http://placekitten.com/400/252" />
                        </div>
                      </div>
                      <ul class="preview-thumbnail nav nav-tabs">
                        <li class="active">
                          <a data-target="#pic-1" data-toggle="tab">
                            <img src="http://placekitten.com/200/126" />
                          </a>
                        </li>
                        <li>
                          <a data-target="#pic-2" data-toggle="tab">
                            <img src="http://placekitten.com/200/126" />
                          </a>
                        </li>
                        <li>
                          <a data-target="#pic-3" data-toggle="tab">
                            <img src="http://placekitten.com/200/126" />
                          </a>
                        </li>
                        <li>
                          <a data-target="#pic-4" data-toggle="tab">
                            <img src="http://placekitten.com/200/126" />
                          </a>
                        </li>
                        <li>
                          <a data-target="#pic-5" data-toggle="tab">
                            <img src="http://placekitten.com/200/126" />
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div class="details col-md-6">
                      <h3 class="product-title">men's shoes fashion</h3>
                      <div class="rating">
                        <div class="stars">
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star checked"></span>
                          <span class="fa fa-star"></span>
                          <span class="fa fa-star"></span>
                        </div>
                        <span class="review-no">41 reviews</span>
                      </div>
                      <p class="product-description">
                        Suspendisse quos? Tempus cras iure temporibus? Eu laudantium cubilia sem
                        sem! Repudiandae et! Massa senectus enim minim sociosqu delectus posuere.
                      </p>
                      <h4 class="price">
                        current price: <span>$180</span>
                      </h4>
                      <p class="vote">
                        <strong>91%</strong> of buyers enjoyed this product!{' '}
                        <strong>(87 votes)</strong>
                      </p>
                      <h5 class="sizes">
                        sizes:
                        <span class="size" data-toggle="tooltip" title="small">
                          s
                        </span>
                        <span class="size" data-toggle="tooltip" title="medium">
                          m
                        </span>
                        <span class="size" data-toggle="tooltip" title="large">
                          l
                        </span>
                        <span class="size" data-toggle="tooltip" title="xtra large">
                          xl
                        </span>
                      </h5>
                      <h5 class="colors">
                        colors:
                        <span
                          class="color orange not-available"
                          data-toggle="tooltip"
                          title="Not In store"
                        ></span>
                        <span class="color green"></span>
                        <span class="color blue"></span>
                      </h5>
                      <div class="action">
                        <button class="add-to-cart btn btn-default" type="button">
                          add to cart
                        </button>
                        <button class="like btn btn-default" type="button">
                          <span class="fa fa-heart"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>

          {/* Right Column */}
          <Grid item md={4}>
            <div className="sidebar">
              <Typography variant="h6" component="h3" sx={{ textTransform: 'uppercase' }}>
                Browse by Category
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <ul className="category-list">
                  {cates.map((cate) => (
                    <li key={cate?.id} className="category-item">
                      <strong>{cate?.name}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ProductsDetail;
