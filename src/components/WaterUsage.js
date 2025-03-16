import { Grid, Card, CardContent, Typography, useMediaQuery, useTheme, Box } from '@mui/material';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import ShowerIcon from '@mui/icons-material/Shower';
import SpaIcon from '@mui/icons-material/Spa';

export default function WaterUsage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const usageData = [
        {
            icon: <LocalDrinkIcon fontSize="large" />,
            title: "Drinking Water",
            description:
                "Current water quality is suitable for drinking after standard treatment. Boil water for 3 minutes to ensure safety."
        },
        {
            icon: <ShowerIcon fontSize="large" />,
            title: "Bathing & Hygiene",
            description:
                "Safe for bathing and personal hygiene. Avoid ingestion and keep away from open wounds or cuts."
        },
        {
            icon: <SpaIcon fontSize="large" />,
            title: "Agricultural Use",
            description:
                "Suitable for irrigation of non-edible plants. Not recommended for leafy vegetables without treatment."
        }
    ];

    return (
        <Box
            sx={{
                py: { xs: 4, md: 8 },
                px: { xs: 1, sm: 2, md: 4 },
                mx: 'auto',
                maxWidth: '1200px'
            }}
        >
            <Grid container spacing={{ xs: 2, md: 4 }}>
                {usageData.map((usage, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                p: { xs: 1, sm: 2, md: 2 },
                                boxShadow: 3,
                                borderRadius: 4,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        mb: 2,
                                        color: theme.palette.primary.main,
                                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                    }}
                                >
                                    {usage.icon}
                                </Box>
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.5rem' }
                                    }}
                                >
                                    {usage.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                        color: theme.palette.text.secondary,
                                        lineHeight: 1.5
                                    }}
                                >
                                    {usage.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
