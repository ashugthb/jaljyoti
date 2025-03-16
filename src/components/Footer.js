"use client";
import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function Footer() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [openAdminLogin, setOpenAdminLogin] = useState(false);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    const footerLinks = [
        { name: "Home", href: "#home" },
        { name: "About JalJyoti", href: "#about" },
        { name: "Water Usage", href: "#water-usage" },
        { name: "Our Team", href: "#team" },
        { name: "Contact", href: "#contact" },
    ];

    const handleLinkClick = (e, href) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleAdminLoginSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('adminName');
        const password = formData.get('adminPassword');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setIsAdminLoggedIn(true);
                setOpenAdminLogin(false);
                window.location.href = '/admin-dashboard';
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAdminLoggedIn(true);
        }
    }, []);

    return (
        <Box sx={{ bgcolor: "#212121", color: "#fff", py: 6, mt: 8 }}>
            <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 0 } }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={1}>
                            {footerLinks.map((link, index) => (
                                <Grid item xs={6} sm={4} key={index}>
                                    <Link
                                        href={link.href}
                                        onClick={(e) => handleLinkClick(e, link.href)}
                                        color="inherit"
                                        underline="none"
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            transition: "color 0.3s ease, transform 0.3s ease",
                                            "&:hover": {
                                                color: "#FF9800",
                                                transform: "translateY(-3px)",
                                            },
                                        }}
                                    >
                                        <Typography variant="body1">{link.name}</Typography>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "right" }, pr: { md: 0 } }}>
                        <Button
                            variant="outlined"
                            onClick={isAdminLoggedIn ? () => window.location.href = '/admin-dashboard' : () => setOpenAdminLogin(true)}
                            sx={{
                                borderColor: "#FF9800",
                                color: "#FF9800",
                                transition: "transform 0.3s ease, background-color 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "#FF9800",
                                    color: "#fff",
                                    transform: "scale(1.03)",
                                },
                                px: 3,
                                py: 1,
                            }}
                        >
                            {isAdminLoggedIn ? "Admin Dashboard" : "Admin Login"}
                        </Button>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2, textAlign: "right" }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 400 }}>
                        © {new Date().getFullYear()} JalJyoti - All rights reserved.
                    </Typography>
                </Box>
            </Container>
            <Dialog open={openAdminLogin} onClose={() => setOpenAdminLogin(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.6rem", borderBottom: "2px solid #FF9800", pb: 1, mb: 2 }}>
                    Admin Login
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleAdminLoginSubmit} id="admin-login-form">
                        <TextField margin="normal" required fullWidth label="Name / Contact" name="adminName" autoFocus size="small" />
                        <TextField margin="normal" required fullWidth label="Password" name="adminPassword" type="password" size="small" />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                        onClick={() => setOpenAdminLogin(false)}
                        variant="outlined"
                        sx={{
                            borderColor: "#FF9800",
                            color: "#FF9800",
                            transition: "transform 0.3s ease, background-color 0.3s ease",
                            "&:hover": { backgroundColor: "#FF9800", color: "#fff" },
                            px: 3,
                            py: 1,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="admin-login-form"
                        variant="contained"
                        sx={{
                            backgroundColor: "#FF9800",
                            color: "#fff",
                            transition: "transform 0.3s ease, background-color 0.3s ease",
                            "&:hover": { backgroundColor: "#E68900" },
                            px: 3,
                            py: 1,
                        }}
                    >
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}