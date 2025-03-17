import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function GallerySlider() {
    // Array of image URLs – update with your own paths
    const images = [
        '/img1.jpg',
        '/img1.jpg',
        '/img1.jpg',
        '/img1.jpg',
        '/img1.jpg',
        '/logo.jpg',
        '/logo.jpg',
        '/images/gallery8.jpg',
    ];

    const imagesPerSlide = 4;
    const totalSlides = Math.ceil(images.length / imagesPerSlide);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000);
        return () => clearInterval(timer);
    }, [totalSlides]);

    // Split images into slides
    const slides = [];
    for (let i = 0; i < totalSlides; i++) {
        slides.push(images.slice(i * imagesPerSlide, i * imagesPerSlide + imagesPerSlide));
    }

    // Navigation handlers (optional for desktop)
    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };
    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    // Fade-in animation for slide transition
    const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

    return (
        <Box sx={{ maxWidth: { xs: '100%', lg: '1550px' }, mx: 'auto', py: 12, px: 2, position: 'relative', background: 'linear-gradient(135deg, #F1F8E9, #E0F2F1)' }}>
            {/* Left-aligned heading with decorative accent */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    align="left"
                    sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        color: '#00796B', // dark teal
                        textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                    }}
                >
                    Image Gallery
                </Typography>
                <Box sx={{ height: 4, width: 80, backgroundColor: '#00796B', mt: 1, borderRadius: 2 }} />
            </Box>

            {/* Gallery container */}
            <Box
                sx={{
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                    background: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)', // soft teal/mint gradient
                    p: 2,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        width: `${totalSlides * 100}%`,
                        transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
                        transition: 'transform 1s ease',
                        animation: `${fadeIn} 1s ease`,
                    }}
                >
                    {slides.map((slide, slideIndex) => (
                        <Box
                            key={slideIndex}
                            sx={{
                                width: `${100 / totalSlides}%`,
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 2,
                            }}
                        >
                            {slide.map((img, i) => (
                                <Box
                                    key={i}
                                    component="img"
                                    src={img}
                                    alt={`Gallery Image ${slideIndex * imagesPerSlide + i + 1}`}
                                    sx={{
                                        width: '100%',
                                        height: { xs: '150px', md: '200px' },
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0px 8px 16px rgba(0,0,0,0.3)',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    ))}
                </Box>

                {/* Navigation arrows for desktop */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 16,
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        display: { xs: 'none', md: 'flex' },
                    }}
                >
                    <IconButton
                        onClick={handlePrev}
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: '#fff',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
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
                        display: { xs: 'none', md: 'flex' },
                    }}
                >
                    <IconButton
                        onClick={handleNext}
                        sx={{
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: '#fff',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}
