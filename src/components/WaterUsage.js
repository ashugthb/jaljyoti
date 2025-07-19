import { Grid, Card, CardContent, Typography, useMediaQuery, useTheme, Box, Divider } from '@mui/material';

export default function WaterUsage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const usageData = [
        {
            image: '/bg2.webp',
            title: "Drinking Water",
            description:
                "Current water quality is suitable for drinking after standard treatment. Boil water for 3 minutes to ensure safety."
        },
        {
            image: '/bg3.webp',
            title: "Bathing & Hygiene",
            description:
                "Safe for bathing and personal hygiene. Avoid ingestion and keep away from open wounds or cuts."
        },
        {
            image: '/bg4.webp',
            title: "Agricultural Use",
            description:
                "Suitable for irrigation of non-edible plants. Not recommended for leafy vegetables without treatment."
        }
    ];

    return (
        <Box
            sx={{
                py: { xs: 4, md: 8 },
                px: { xs: 2, md: 4 },
                mx: 'auto',
                maxWidth: { xs: '100%', lg: '1550px' },
                background: 'linear-gradient(135deg, #FFFFFF, #E0F2F1)',
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h4"
                align="center"
                sx={{
                    fontWeight: 'bold',
                    fontFamily: '"Montserrat", sans-serif',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, #00838F)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: { xs: 10, md: 8, }
                }}
            >
                Water Usage Information
            </Typography>

            <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mt: { xs: 2, md: 4 } }}>
                {usageData.map((usage, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                p: 3,
                                boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'visible',
                                background: '#fff',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0px 8px 16px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            {/* Floating image container without border */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '-80px',
                                    width: '170px',
                                    height: '170px',
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={usage.image}
                                    alt={usage.title}
                                    sx={{
                                        width: '170px',
                                        height: '170px',
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
                                        }
                                    }}
                                />
                            </Box>

                            <CardContent sx={{ mt: 10 }}>
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        color: '#333',
                                    }}
                                >
                                    {usage.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#666',
                                        lineHeight: 1.9,
                                        px: 1,
                                    }}
                                >
                                    {usage.description}
                                </Typography>
                            </CardContent>

                            {/* Decorative element with accent color */}
                            <Box sx={{ mt: 2, mb: 1 }}>
                                <Divider
                                    sx={{
                                        width: '50%',
                                        borderColor: theme.palette.primary.main,
                                        mx: 'auto',
                                        mb: 1,
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.palette.primary.main,
                                        fontStyle: 'italic',
                                    }}
                                >
                                    More Info &rarr;
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
