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
        { src: '/img1.jpg', caption: 'First Image' },
        { src: '/img2.jpg', caption: 'Director of NIH Roorkee', isPortrait: true },
        { src: '/img3.jpg', caption: 'Sharmilla Oswal Millet Woman of India' },
        { src: '/img4.jpg', caption: 'Presenting the kit to an audience.' },
    ];

    const imagesPerSlide = isMobile ? 1 : 4;
    const totalSlides = Math.ceil(images.length / imagesPerSlide);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % totalSlides);
        }, 5000);
        return () => clearInterval(timer);
    }, [totalSlides]);

    // Split images into slides based on imagesPerSlide
    const slides = [];
    for (let i = 0; i < totalSlides; i++) {
        slides.push(images.slice(i * imagesPerSlide, i * imagesPerSlide + imagesPerSlide));
    }

    // Navigation handlers
    const handlePrev = () => {
        setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    };
    const handleNext = () => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
    };

    // Fade-in animation for slide transition with a slight scale effect
    const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  `;

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
                                gridTemplateColumns: `repeat(${isMobile ? 1 : 4}, 1fr)`,
                                gap: 3,
                            }}
                        >
                            {slide.map((img, i) => (
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
                                            alt={`Gallery Image ${slideIndex * imagesPerSlide + i + 1}`}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                // For portrait images, position at the top and clip to show only top half
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
