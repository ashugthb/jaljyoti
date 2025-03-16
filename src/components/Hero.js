import { Box, Typography, Container } from '@mui/material';
import { keyframes } from '@mui/system';

export default function Hero({ isMobile }) {
    // Define a fade-in up keyframes animation
    const fadeInUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

    return (
        <Box
            sx={{
                position: 'relative',
                backgroundImage: 'url(/bg-1.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                py: isMobile ? 8 : 15,
                textAlign: 'center',
                overflow: 'hidden',
            }}
        >
            {/* Darker Gradient Overlay for better text contrast */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)',
                    zIndex: 1,
                    animation: `${fadeInUp} 2s ease-out`,
                }}
            />
            <Container
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    color: '#fff',
                }}
            >
                <Typography
                    variant={isMobile ? 'h4' : 'h2'}
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                        animation: `${fadeInUp} 1.5s ease-out forwards`,
                    }}
                >
                    Monitor Water Quality in Real-Time
                </Typography>
                <Typography
                    variant={isMobile ? 'body1' : 'h6'}
                    sx={{
                        textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                        mb: 4,
                        animation: `${fadeInUp} 1.8s ease-out forwards`,
                    }}
                >
                    Our advanced monitoring system provides accurate measurements and alerts,
                    ensuring the safety and purity of your water supply.
                </Typography>
                {/* Additional animated elements */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        animation: `${fadeInUp} 2s ease-out forwards`,
                    }}
                >
                    <Typography
                        variant={isMobile ? 'h6' : 'h5'}
                        sx={{
                            fontWeight: 600,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                        }}
                    >
                        Real-Time Data • Advanced Sensors • 24/7 Monitoring
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                    >
                        Join us in revolutionizing water quality management with state-of-the-art technology designed for precision and reliability.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
