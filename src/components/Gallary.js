import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function GallerySlider() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Updated array of image objects with captions and an optional portrait flag.
    const images = [
        { src: '/img1.jpg', caption: 'Received the First Poster Award at NIH Roorkee for the PSD Test.' },
        { src: '/img2.jpg', caption: 'Director of NIH Roorkee', isPortrait: true },
        { src: '/img3.jpg', caption: 'Sharmilla Oswal Millet Woman of India' },
        { src: '/img4.jpg', caption: 'Presenting the kit to an audience.' },
        { src: '/img5.jpg', caption: 'Shwoing test in THRIVE exhibition' },
        { src: '/img7.jpg', caption: 'Demonstrating test to the prof. M. Jagadesh Kumar (Former chairman of UGC) ' },
        { src: '/img8.jpg', caption: 'Kit presentaion in rural area ' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const imagesPerView = isMobile ? 1 : 4;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 2000);
        return () => clearInterval(timer);
    }, [images.length]);

    const handlePrev = () => {
        setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % images.length);
    };

    const getVisibleImages = () => {
        if (isMobile) {
            return [images[currentIndex]];
        }
        const visibleImages = [];
        for (let i = 0; i < imagesPerView; i++) {
            visibleImages.push(images[(currentIndex + i) % images.length]);
        }
        return visibleImages;
    };

    

    return (
        <Box
            sx={{
                maxWidth: { xs: '100%', lg: '1550px' },
                mx: 'auto',
                py: 12,
                px: 2,
                position: 'relative',
                background: 'linear-gradient(135deg, #FFFFFF, #E0F2F1)',
            }}
        >
            {/* Heading */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    align="left"
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        color: '#2C3E50',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    Image Gallery
                </Typography>
                <Box sx={{ height: 4, width: 80, backgroundColor: '#2C3E50', mt: 1, borderRadius: 2 }} />
            </Box>

            {/* Gallery container */}
            <Box
                sx={{
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #FFFFFF, #F7F9FC)',
                    p: 2,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${imagesPerView}, 1fr)`,
                        gap: 3,
                        transition: 'transform 0.5s ease-in-out',
                    }}
                >
                    {getVisibleImages().map((img, i) => (
                        <Box
                            key={i}
                            sx={{
                                background: 'linear-gradient(135deg, #fff, #f7f9fc)',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px) scale(1.02)',
                                    boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
                                },
                            }}
                        >
                            {/* Image container */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: { xs: '200px', md: '250px' },
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={img.src}
                                    alt={`Gallery Image ${i + 1}`}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: img.isPortrait ? 'top' : 'center',
                                        clipPath: img.isPortrait ? 'inset(0 0 0%)' : 'none',
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: '#fff',
                                    textAlign: 'center',
                                    borderTop: '1px solid #e0e0e0',
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 500,
                                        color: '#2C3E50',
                                    }}
                                >
                                    {img.caption}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Navigation arrows for larger screens */}
                {!isMobile && (
                    <>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: 16,
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                            }}
                        >
                            <IconButton
                                onClick={handlePrev}
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.4)' },
                                }}
                            >
                                <ArrowBackIosNewIcon />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: 16,
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                            }}
                        >
                            <IconButton
                                onClick={handleNext}
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.4)' },
                                }}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}
