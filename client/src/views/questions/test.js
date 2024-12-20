<Grid item md={8}>
<Box
    sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
    }}
>
    {/* Create Post Header */}
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" alignItems="center" mb={2}>
            <Avatar
                src={userData?.current?.imageUrl || avatardefault}
                alt="Hình ảnh người dùng"
                sx={{ width: 48, height: 48, marginRight: 2 }}
                onError={(e) => {
                    e.target.src = avatardefault;
                }}
            />
            <Typography variant="h6" fontWeight="bold">
                Đặt câu hỏi
            </Typography>
        </Box>
        {/* Tiêu đề bài viết */}
        <TextField
            fullWidth
            placeholder="Bạn muốn hỏi gì?"
            variant="standard"
            sx={{ marginBottom: 2, borderRadius: '8px' }}
            {...register("title", {
                required: "Tiêu đề là bắt buộc",
                maxLength: { value: 100, message: "Tiêu đề không được quá 100 ký tự" },
            })}
            InputProps={{
                disableUnderline: true,
            }}
            error={!!errors.title}
            helperText={errors.title && (errors.title.type === 'minLength'
                ? "Title must be at least 3 characters long"
                : errors.title.message)}
        />
    </Box>

    {/* Loading Spinner */}
    {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
        </Box>
    ) : listQuestion?.length > 0 ? (
        listQuestion
            .sort((a, b) => (a.updatedAt.seconds < b.updatedAt.seconds ? 1 : -1))
            .map((question) => {
                const listImgUrl = question.imageUrls;
                const listFileUrl = question.fileUrls;
                return (
                    <Box
                        key={question?.id}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '20px',
                            marginTop: '20px',
                            backgroundColor: '#fff',
                        }}
                    >
                        {/* Post Header */}
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                        >
                            <Box display="flex" alignItems="center">
                                <img
                                    src={
                                        users?.find((u) => question?.user_id === u.id)?.imageUrl ||
                                        avatardefault
                                    }
                                    alt="Hình ảnh người dùng"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        marginRight: 8,
                                    }}
                                    onError={(e) => {
                                        e.target.src = avatardefault;
                                    }}
                                />
                               
                            </Box>
                            {question?.user_id === userData.current?.id && (
                                <>
                                    <Tooltip title="Options">
                                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={() => setAnchorEl(null)}
                                    >
                                        <MenuItem onClick={() => onEdit(question)}>Sửa</MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Box>
                        {/* Content Section */}
                        {edit ? (
                            <Box component="form" mt={2} onSubmit={handleEdit}>
                                <TextField
                                    label="Hãy chia sẻ kiến thức hoặc đặt câu hỏi?"
                                    variant="outlined"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    name="questions"
                                    value={dataTemp.questions}
                                    onChange={handleInputChange}
                                    sx={{ marginBottom: 2 }}
                                />

                        
                            </Box>
                        ) : (
                            <>
                                <ButtonBase
                                    sx={{
                                        display: 'block',
                                        textAlign: 'left',
                                        width: '100%',
                                    }}
                                    onClick={() => handleCardClick(question.id)}
                                >
                                    {/* Display Question Content */}
                                    <Box sx={{ mt: 3, mb: 3 }}>
                                        <Typography variant="h5" component="h2" className="article-title">
                                            {question?.title.length > 100
                                                ? `${question?.title.substring(0, 100)}...`
                                                : question?.title}
                                        </Typography>

                                      

                                    </Box>
                                    {/* Hiển thị tệp */}
                                    {listFileUrl && listFileUrl.length > 0 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '10px',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                backgroundColor: '#fff',
                                                width: 'fit-content',
                                                height: '30px',
                                            }}
                                        >
                                            <IconButton sx={{ color: '#007bff' }}>
                                                <DescriptionIcon />
                                            </IconButton>
                                            <Typography variant="subtitle1">
                                                {listFileUrl.map((url, index) => {
                                                    const fileNameWithExt = decodeURIComponent(url)
                                                        .split('/')
                                                        .pop()
                                                        .split('?')[0];
                                                    const cleanFileName = fileNameWithExt
                                                        .replace(/^\d+_*/, '')
                                                        .replace(/-/g, '');
                                                    return cleanFileName !== 'uploads' ? (
                                                        <a
                                                            key={index}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: 'inherit',
                                                                textDecoration: 'none',
                                                                fontSize: '14px',
                                                                marginRight: '10px',
                                                            }}
                                                        >
                                                            {cleanFileName}  {/* Display the cleaned file name */}
                                                        </a>
                                                    ) : null;
                                                })}
                                            </Typography>
                                        </Box>
                                    )}
                                    {/* Hiển thị ảnh */}
                                    {listImgUrl && listImgUrl.length > 0 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                                gap: '10px',
                                            }}
                                        >
                                                   )}
                                </ButtonBase>
                                {/* Hiển thị mã code */}
                                {question?.up_code && (
                                    <Box sx={{ mt: 3, mb: 3 }}>
                                        <SyntaxHighlighter language="javascript" style={dracula}>
                                            {expandedQuestions[question.id]
                                                ? question.up_code
                                                : question.up_code.length > 500
                                                    ? `${question.up_code.substring(0, 500)}...`
                                                    : question.up_code}
                                        </SyntaxHighlighter>

                                        {/* Chỉ hiển thị nút "Xem thêm/Rút gọn" nếu độ dài mã code lớn hơn 500 */}
                                        {question.up_code.length > 500 && (
                                            <Button
                                                size="small"
                                                onClick={() => handleToggle(question.id)}
                                                sx={{ mt: 1 }}
                                            >
                                                {expandedQuestions[question.id] ? 'Rút gọn' : 'Xem thêm'}
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </>
                        )}
                        <Divider sx={{ my: 2 }} />
                        {/* Like and Comment Buttons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <IconButton>
                                <FavoriteBorderIcon />
                            </IconButton>
                            <Typography variant="body2">Thích</Typography>
                            <IconButton
                                sx={{ ml: 2 }}
                                onClick={() => handleToggleComments(question.id)}
                            >
                                <IconMessageCircle />
                            </IconButton>
                            <Typography variant="body2">
                                Bình luận ({question.comments?.length || 0})
                            </Typography>
                        </Box>
                        {/* Comment Section */}
                        {visibleComments[question.id] && (
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                {/* Kiểm tra xem người dùng đã đăng nhập hay chưa */}
                                {!isLoggedIn ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Vui lòng <Link to="/auth/login" style={{ color: '#007bff', textDecoration: 'underline' }}>đăng nhập</Link> để xem và bình luận.
                                    </Typography>
                                ) : (
                                    <>
                                        <Container maxWidth="xl" sx={{ padding: 2 }}>
                                            <Box sx={{ mt: 3, mb: 3 }}>
                                                {/* Comment Input */}
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                    }}
                                                >
                                                    {/* Avatar và Text Input */}
                                                    <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                                                        <img
                                                            src={currentUserImage || avatardefault}
                                                            alt="Hình ảnh người dùng"
                                                            width="30px"
                                                            style={{ borderRadius: '50%', marginRight: '10px' }}
                                                            onError={(e) => {
                                                                e.target.src = avatardefault; // Hiển thị ảnh mặc định nếu ảnh không tải được
                                                            }}
                                                        />
                                                        <TextField
                                                            placeholder={`Bình luận dưới tên ${userData.current ? users.find((user) => user.id === userData.current.id)?.name : 'Người dùng'} `}
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            sx={{
                                                                backgroundColor: '#f0f0f0',
                                                            }}
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                        />
                                                    </Box>

                                                    {/* File input cho hình ảnh */}
                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        sx={{ width: '100%', marginLeft: ' 80px', marginTop: '-10px' }}
                                                    >
                                                        <Box display="flex" gap={1}>
                                                            {['Hình ảnh', 'Tệp', 'Code'].map((label, index) => (
                                                                <Button
                                                                    key={index}
                                                                    variant="outlined"
                                                                    startIcon={
                                                                        index === 0 ? (
                                                                            <ImageIcon />
                                                                        ) : index === 1 ? (
                                                                            <AttachFileIcon />
                                                                        ) : (
                                                                            <CodeIcon />
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        borderRadius: '16px',
                                                                        textTransform: 'none',
                                                                        padding: '5px 15px',
                                                                    }}
                                                                    component="label"
                                                                    onClick={index === 2 ? handleCodeButtonClick : undefined}
                                                                >
                                                                    {label}
                                                                    {index === 0 && (
                                                                        <input
                                                                            name="image"
                                                                            type="file"
                                                                            accept="image/*"
                                                                            multiple
                                                                            hidden
                                                                            onChange={(e) => setImageFile(e.target.files[0])}
                                                                        />
                                                                    )}
                                                                    {index === 1 && (
                                                                        <input
                                                                            type="file"
                                                                            name="file"
                                                                            multiple
                                                                            hidden
                                                                            onChange={(e) => setFile(e.target.files[0])}
                                                                        />
                                                                    )}
                                                                </Button>
                                                            ))}
                                                        </Box>

                                                        {/* Post Button */}
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            color="primary"
                                                            sx={{
                                                                textTransform: 'none',
                                                                borderRadius: '16px',
                                                                padding: '5px 20px',
                                                                fontWeight: 'bold',
                                                                marginRight: '45px',
                                                            }}
                                                            onClick={() => handleAddComment(question.id)}
                                                        >
                                                            Gửi
                                                        </Button>
                                                    </Box>

                                                    {/* Code Dialog */}
                                                    <Dialog
                                                        open={showCodeDialog}
                                                        onClose={handleCloseDialog}
                                                        maxWidth="sm"
                                                        fullWidth
                                                    >
                                                        <DialogTitle>Nhập code của bạn</DialogTitle>
                                                        <DialogContent>
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    id="code-input"
                                                                    multiline
                                                                    rows={4}
                                                                    name="up_code"
                                                                    variant="outlined"
                                                                    value={codeSnippet}
                                                                    onChange={handleCodeChange}
                                                                    error={!!error}
                                                                />
                                                                <FormHelperText>{error}</FormHelperText>
                                                            </FormControl>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={handleCloseDialog} color="secondary">
                                                                Hủy
                                                            </Button>
                                                            <Button onClick={handleSubmitCode} color="primary">
                                                                Lưu
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </Box>
                                             
                                            </Box>
                                        </Container>
                                    </>
                                )}
                            </Box>
                        )}
                    </Box>
                );
            })
    ) : (
        <Typography variant="h6" align="center" sx={{ mt: 3 }}>
            Không có câu hỏi nào.
        </Typography>
    )}
</Box>
</Grid>