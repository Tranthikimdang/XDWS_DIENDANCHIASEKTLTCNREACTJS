import React from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { Link } from 'react-router-dom';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { signInWithGoogle } from '../../config/firebaseconfig'; // Import signInWithGoogle

const AuthLogin = ({ title, subtitle, subtext }) => (
    <>
        {title && (
            <Typography fontWeight="700" variant="h2" mb={1}>
                {title}
            </Typography>
        )}

        {subtext}

        <Stack spacing={3}>
            <Box>
                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="username" mb="5px">
                    Username
                </Typography>
                <CustomTextField id="username" variant="outlined" fullWidth />
            </Box>
            <Box>
                <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px">
                    Password
                </Typography>
                <CustomTextField id="password" type="password" variant="outlined" fullWidth />
            </Box>
            <Stack justifyContent="space-between" direction="row" alignItems="center">
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Remember this Device"
                    />
                </FormGroup>
                <Typography
                    component={Link}
                    to="/"
                    fontWeight="500"
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                    }}
                >
                    Forgot Password?
                </Typography>
            </Stack>
        </Stack>
        <Box mt={3}>
            <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                to="/"
                type="submit"
            >
                Sign In
            </Button>
        </Box>

        {/* Nút đăng nhập bằng Google */}
        <Box mt={2}>
            <Button
                color="secondary"
                variant="contained"
                size="large"
                fullWidth
                onClick={signInWithGoogle}  // Gọi hàm đăng nhập Google khi nhấn nút
            >
                Sign in with Google
            </Button>
        </Box>
        {subtitle}
    </>
);

export default AuthLogin;
