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
        return "https://docs.google.com/presentation/d/e/2PACX-1vRPJh2QdcJImX4DELW-7zxBL55ONjJHoYrxvm_O0u2cJPvwpj2KNJh6zLbKfiD_VA/embed?start=true&loop=true&delayms=3000";
    }, []);

    return (
        <Container sx={{ py: { xs: 4, md: 7 } }}>
            <Typography
                variant="h3"
                align="center"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: '#00BCD4',
                    borderBottom: '2px solid #00BCD4',
                    display: 'inline-block',
                    pb: 1,
                    animation: `${fadeIn} 1s ease-out`
                }}
            >
                Our Presentation
            </Typography>
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    height: { xs: '380px', md: '430px' },
                    borderRadius: 2,
                    boxShadow: 3,
                    animation: `${fadeIn} 1s ease-out`,
                    mb: 2
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
                        border: 'none'
                    }}
                    allowFullScreen
                    title="Google Slides Presentation"
                    loading="lazy" // Lazy load the iframe for better performance
                />
            </Box>
        </Container>
    );
}