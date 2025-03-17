import { Grid, Card, CardContent, Typography, useMediaQuery, useTheme, Box, Divider } from '@mui/material';

export default function WaterUsage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const usageData = [
        {
            image: '/logo.jpg',
            title: "Drinking Water",
            description:
                "Current water quality is suitable for drinking after standard treatment. Boil water for 3 minutes to ensure safety."
        },
        {
            image: '/logo.jpg',
            title: "Bathing & Hygiene",
            description:
                "Safe for bathing and personal hygiene. Avoid ingestion and keep away from open wounds or cuts."
        },
        {
            image: '/plant.jpg',
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
                background: 'linear-gradient(135deg, #B2DFDB, #C8E6C9)', // light teal/mint gradient
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h4"
                align="center"
                sx={{
                    fontWeight: 'bold',
                    fontFamily: '"Montserrat", sans-serif',
                    background: 'linear-gradient(45deg, #00BCD4, #43A047)', // dark cyan and algae green gradient
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                    mb: { xs: 4, md: 6 },
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
                                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                borderRadius: 3,
                                position: 'relative',
                                overflow: 'visible',
                                background: 'linear-gradient(135deg, #4DB6AC, #81C784)', // mix of teal and green
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0px 8px 16px rgba(0,0,0,0.3)',
                                },
                            }}
                        >
                            {/* Floating square image */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '-80px',
                                    width: '170px',
                                    height: '170px',
                                    borderRadius: 20, // slight rounding; set to 0 for a perfect square
                                    background: 'linear-gradient(45deg, #00BCD4, #43A047)', // darker gradient for contrast
                                    boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={usage.image}
                                    alt={usage.title}
                                    sx={{ width: '170px', height: '170px', objectFit: 'cover', borderRadius: 20 }}
                                />
                            </Box>

                            <CardContent sx={{ mt: 10 }}>
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        color: '#ffffff',
                                    }}
                                >
                                    {usage.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#E0F2F1', // light cyan/teal text for description
                                        lineHeight: 1.9,
                                        px: 1,
                                    }}
                                >
                                    {usage.description}
                                </Typography>
                            </CardContent>

                            {/* Decorative element */}
                            <Box sx={{ mt: 2, mb: 1 }}>
                                <Divider
                                    sx={{
                                        width: '50%',
                                        borderColor: '#00000',
                                        mx: 'auto',
                                        mb: 1,
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#00000',
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
