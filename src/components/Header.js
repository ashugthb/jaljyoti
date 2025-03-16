import { AppBar, Toolbar, IconButton, Drawer, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { useState } from 'react';

export default function Header({ isMobile, activeTab, navItems, scrollToSection }) {
    const [open, setOpen] = useState(false);

    // Updated style: Active items now use #FF9800 for text and underline.
    const navItemStyle = (isActive) => ({
        cursor: 'pointer',
        padding: '0.5rem 1rem',
        color: isActive ? '#FF9800' : '#FFFFFF',
        borderBottom: isActive ? '2px solid #FF9800' : '2px solid transparent',
        transition: 'all 0.3s ease-in-out',
        fontWeight: isActive ? 600 : 400,
    });

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#000', boxShadow: 'none' }}>
            <Toolbar>
                <Image
                    src="/logo.jpg"
                    alt="Logo"
                    width={50}
                    height={50}
                    style={{ cursor: 'pointer' }}
                    onClick={() => scrollToSection(navItems[0].ref, navItems[0].label)}
                />

                {isMobile ? (
                    <>
                        <IconButton onClick={() => setOpen(true)} sx={{ marginLeft: 'auto', color: '#FFF' }}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={open}
                            onClose={() => setOpen(false)}
                            PaperProps={{
                                sx: { backgroundColor: '#000', color: '#FFF', width: 250 },
                            }}
                        >
                            <Box sx={{ p: 2 }}>
                                <List>
                                    {navItems.map((item) => (
                                        <ListItem key={item.id} disablePadding>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        onClick={() => {
                                                            scrollToSection(item.ref, item.label);
                                                            setOpen(false);
                                                        }}
                                                        sx={navItemStyle(activeTab === item.label)}
                                                    >
                                                        {item.label}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    // Desktop nav items aligned to the right
                    <Box sx={{ display: 'flex', gap: '2rem', marginLeft: 'auto' }}>
                        {navItems.map((item) => (
                            <Typography
                                key={item.id}
                                onClick={() => scrollToSection(item.ref, item.label)}
                                sx={navItemStyle(activeTab === item.label)}
                            >
                                {item.label}
                            </Typography>
                        ))}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
