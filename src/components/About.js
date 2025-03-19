import { Box, Container, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import { useMemo } from 'react';

// Define a fade-in keyframes animation for smooth appearance
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function About() {
    // Replace baseUrl with your published Google Slides embed URL
    const baseUrl = useMemo(() => {
        return "https://docs.google.com/presentation/d/e/2PACX-1vSXqS7lNFepCCH4dz0lSsxKkGxlcr7y1JAj_vxBrGRyLldAzVQby-gQ5fv0cQ7_UNEFrcTMygsxH4uv/embed?start=true&loop=true&delayms=3000";
    }, []);

    return (
        <Container
            sx={{
                py: { xs: 3, md: 5 },
                px: { xs: 2, md: 4 },
                mx: 'auto',
                maxWidth: { xs: '100%', lg: '1550px' }, // full width on mobile
                background: 'linear-gradient(135deg, #FFFFFF, #E0F2F1)',// gentle light green/teal gradient
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            }}
        >
            <Typography
                variant="h4"
                align="left"
                sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontWeight: 700,
                    mb: { xs: 4, md: 6 },
                    color: '#00796B', // dark teal for heading
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    animation: `${fadeIn} 1s ease-out`,
                }}
            >
                About Jaljyoti
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, md: 4 },
                    justifyContent: 'center',
                    alignItems: 'center',
                    mx: { xs: 0, md: 3 },
                }}
            >
                {/* Google Slides Container */}
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        width: { xs: '100%', md: '45%' },
                        height: { xs: '300px', md: '380px' },
                        borderRadius: 2,
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                        background: 'linear-gradient(135deg, #E0F7FA, #B2DFDB)',
                        animation: `${fadeIn} 1s ease-out`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.04)',
                            boxShadow: '0px 6px 12px rgba(0,0,0,0.3)',
                        },
                        ml: { md: '-20px' },
                    }}
                >
                    <iframe
                        src={baseUrl}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        allowFullScreen
                        title="Google Slides Presentation"
                        loading="lazy"
                    />

                    {/* <iframe src="" frameborder="0" width="3178" height="2274" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe> */}
                </Box>

                {/* Video Container */}
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        width: { xs: '100%', md: '55%' },
                        aspectRatio: '16/9',
                        borderRadius: 2,
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                        animation: `${fadeIn} 1s ease-out`,
                        border: '2px solid',
                        borderImage: 'linear-gradient(45deg, #00BCD4, #43A047) 1',
                        backgroundColor: '#ECEFF1',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.04)',
                            boxShadow: '0px 6px 12px rgba(0,0,0,0.3)',
                        },
                    }}
                >
                    <video
                        src="/video.mp4"
                        controls
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>
            </Box>
        </Container>
    );
}
