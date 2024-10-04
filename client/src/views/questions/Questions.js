/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import {
    Grid, Box, Typography, IconButton, TextField, Button, List, ListItem, ListItemText, Link, Divider
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CodeIcon from '@mui/icons-material/Code';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconMessageCircle } from '@tabler/icons-react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
const Questions = () => {

    return (
        <PageContainer title="article">
            <DashboardCard>
                <Grid container spacing={2}>
                    {/* Left Column */}
                    <Grid item md={8}>
                        {/* Main Box for Post Creation */}
                        <Box
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '20px',
                                backgroundColor: '#fff',
                            }}
                        >
                            {/* Create Post Header */}
                            <Box display="flex" alignItems="center" mb={2}>
                                <img
                                    src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                                    width="40px"
                                    alt="User Avatar"
                                    style={{ borderRadius: '50%', marginRight: '10px' }}
                                />
                                <Typography variant="h6">Tạo bài viết</Typography>
                            </Box>

                            {/* Post Content */}
                            <TextField
                                label="Hãy chia sẻ kiến thức hoặc đặt câu hỏi?"
                                variant="outlined"
                                multiline
                                fullWidth
                                rows={4}
                                // value={newComment}
                                // onChange={(e) => setNewComment(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />

                            {/* Add Hashtag Section */}
                            <Box display="flex" alignItems="center" mb={2}>
                                <Typography variant="body2" sx={{ mr: 2 }}>
                                    <strong>+ Thêm Hashtag</strong>
                                </Typography>
                                <Box sx={{ flexGrow: 1 }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Nhập hashtag"
                                        variant="standard"
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Options for Image, File, Code */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" gap={1}>
                                    {['Hình ảnh', 'Tệp', 'Code'].map((label, index) => (
                                        <Button
                                            key={index}
                                            variant="outlined"
                                            startIcon={
                                                index === 0 ? <ImageIcon /> :
                                                    index === 1 ? <AttachFileIcon /> : <CodeIcon />
                                            }
                                            sx={{
                                                borderRadius: '16px',
                                                textTransform: 'none',
                                                padding: '5px 15px',
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </Box>

                                {/* Post Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '16px',
                                        padding: '5px 20px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Đăng
                                </Button>
                            </Box>
                        </Box>

                        {/* Uploaded Image Section */}
                        <Box
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '20px',
                                marginTop: '20px',
                                backgroundColor: '#fff',
                            }}
                        >
                            {/* Post Header */}
                            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                <Box display="flex" alignItems="center">
                                    <img
                                        src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                                        width="40px"
                                        alt="User Avatar"
                                        style={{ borderRadius: '50%', marginRight: '10px' }}
                                    />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Kim Đang.dev
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            11 hrs
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Box>

                            {/* Content Section */}
                            <Box sx={{ mt: 3, mb: 3 }}>
                                {/* Title Section */}
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    title
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                {/* Content Section */}
                                <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                                    nội dung
                                </Typography>
                            </Box>



                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    gap: '5px',
                                }}
                            >
                                {[1, 2, 3, 4].map((image, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            flexBasis: ['100%', '48%', '32%'][Math.min(2, index)], // Adjust based on index
                                            flexGrow: 1,
                                            maxWidth: ['100%', '48%', '32%'][Math.min(2, index)], // Adjust max width based on index
                                            mb: 2,
                                        }}
                                    >
                                        <img
                                            src="https://tse1.mm.bing.net/th?id=OIP.LZwo3IXK2fmvq3X_SjcLRgHaE8&pid=Api&P=0&h=180"
                                            alt={`Image ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>



                            <Divider sx={{ my: 2 }} />

                            {/* Like and Comment Counts */}
                            <Typography variant="subtitle1" color="textSecondary">
                                345 Likes • 34 Comments
                            </Typography>

                            {/* Like and Comment Buttons */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <IconButton>
                                    <FavoriteBorderIcon />
                                </IconButton>
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    Thích
                                </Typography>
                                <IconButton sx={{ ml: 2 }}>
                                    <IconMessageCircle />
                                </IconButton>
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    Bình luận
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Comment Section */}
                            <Box>
                                <Box display="flex" alignItems="center" mb={1}>
                                    <img
                                        src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                                        alt="User Avatar"
                                        style={{ borderRadius: '50%', marginRight: '10px' }}
                                        width="40px"
                                    />
                                    <TextField
                                        placeholder="Viết bình luận..."
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        sx={{ backgroundColor: '#f0f0f0', borderRadius: '20px' }}
                                    />
                                </Box>

                                {/* Example Comment */}
                                <Box display="flex" alignItems="flex-start" mb={2}>
                                    <img
                                        src="http://localhost:3000/static/media/user-1.479b494978354b339dab.jpg"
                                        alt="Commenter Avatar"
                                        style={{ borderRadius: '50%', marginRight: '10px' }}
                                        width="40px"
                                    />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            Rowan Atkinson
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                backgroundColor: '#f0f2f5',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            She starred as Jane Porter in The @Legend of Tarzan (2016), Tanya Vanderpoel in Whiskey Tango Foxtrot (2016), and as DC Comics villain Harley Quinn in Suicide Squad (2016), for which she was nominated for a Teen Choice Award...
                                        </Typography>

                                        {/* Like and Reply */}
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="subtitle2" color="primary" sx={{ cursor: 'pointer' }}>
                                                thích • phản hồi
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                23 phút trước
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>


                    {/* Right Column */}
                    <Grid item md={4}>
                        <Box
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '20px',
                                backgroundColor: '#fff',
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Từ khóa nổi bật</Typography>
                                <IconButton>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Box>

                            {/* List of Hashtags */}
                            <List>
                                {['#Nhà trọ gần trường', '#Cà phê làm bài yên tĩnh', '#Câu lạc bộ tại trường', '#Học code clean hơn, logic hơn', '#Học bổng tại trường'].map((hashtag, index) => (
                                    <ListItem key={index} sx={{ padding: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Link href="#" underline="none" sx={{ color: '#007bff', fontSize: '0.9rem' }}>
                                                    {hashtag}
                                                </Link>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '20px',
                                marginTop: '20px', // To add space between sections
                                backgroundColor: '#fff',
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Theo dõi người dùng khác</Typography>
                                <IconButton>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Box>

                            {/* Follow List */}
                            <List>
                                {['Katheryn Winnick', 'Katheryn Winnick', 'Katheryn Winnick', 'Katheryn Winnick', 'Katheryn Winnick', 'Katheryn Winnick', 'Katheryn Winnick'].map((name, index) => (
                                    <ListItem key={index} sx={{ padding: 0 }}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                            <Box display="flex" alignItems="center">
                                                <img
                                                    src="/mnt/data/image.png" // Replace with the correct image URL path
                                                    alt={name}
                                                    style={{ borderRadius: '50%', width: '40px', marginRight: '10px' }}
                                                />
                                                <Link href="#" underline="none" sx={{ color: '#007bff', fontSize: '0.9rem' }}>
                                                    {name}
                                                </Link>
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    textTransform: 'none',
                                                    padding: '2px 10px',
                                                    fontSize: '0.8rem',
                                                    borderRadius: '16px',
                                                }}
                                            >
                                                + Theo dõi
                                            </Button>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        {/* Popular Articles Section */}
                        <Box
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '20px',
                                backgroundColor: '#fff',
                                marginTop: '20px', // Space between sections
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Bài viết nổi bật</Typography>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderRadius: '16px',
                                        padding: '5px 10px',
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Mới nhất
                                </Button>
                            </Box>

                            {/* Article List */}
                            <List>
                                {[
                                    { title: "ReactJS Là gì? Và cách thức hoạt động như thế nào?", likes: 100, comments: 50, author: "Kim Đang.dev" },
                                    { title: "TalkShow: Warmup Cuộc Thi Sáng Tạo Lập Trình Trò Chơi", likes: 100, comments: 50, author: "Kim Đang.dev" },
                                    { title: "TalkShow: Warmup Cuộc Thi Sáng Tạo Lập Trình Trò Chơi", likes: 100, comments: 50, author: "Kim Đang.dev" },
                                    { title: "TalkShow: Warmup Cuộc Thi Sáng Tạo Lập Trình Trò Chơi", likes: 100, comments: 50, author: "Kim Đang.dev" },
                                ].map((article, index) => (
                                    <ListItem key={index} sx={{ padding: '10px 0' }}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                            <Box display="flex" alignItems="center">
                                                <img
                                                    src="/mnt/data/image.png" // Replace with the correct image URL path
                                                    alt={article.author}
                                                    style={{ borderRadius: '50%', width: '40px', marginRight: '10px' }}
                                                />
                                                <Box>
                                                    <Link href="#" underline="none" sx={{ color: '#007bff', fontSize: '0.9rem', display: 'block' }}>
                                                        {article.title}
                                                    </Link>
                                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                                        Số lượt thích: {article.likes} | Số bình luận: {article.comments}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                                        Tác giả: {article.author}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>

                            {/* View More Button */}
                            <Button
                                variant="text"
                                sx={{
                                    display: 'block',
                                    textTransform: 'none',
                                    fontSize: '0.9rem',
                                    margin: '10px auto 0 auto',
                                    color: '#007bff',
                                }}
                            >
                                Xem thêm
                            </Button>
                        </Box>

                    </Grid>

                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default Questions;
