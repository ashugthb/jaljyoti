import { Grid, Typography, Avatar, Paper, Box, List, ListItem, Divider } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const teamMembers = [
    {
        name: "Prof. Meenu Chhabra",
        designation: "Non-executive Director",
        image: "/Prof.MeenuChhabra.jpg",
        details: [
            "Distinguished Professor in the Department of Bioscience at IIT Jodhpur.",
            "Head of the Center for Emerging Technologies for Sustainable Development (CETSD).",
            "Expert in biotechnology and environmental microbiology.",
            "Research focuses on microbial technologies for environmental remediation and biosensing applications.",
            "Significant contributions through research, publications, and mentorship in bioscience and technology."
        ]
    },
    {
        name: "Ms. Jyoti Gautam",
        designation: "Director",
        image: "/Ms.JyotiGautam.jpg",
        details: [
            "Research scholar pursuing an integrated M.Tech-Ph.D. at IIT Jodhpur.",
            "Focused on developing advanced biosensors for water quality management.",
            "Specializes in cost-effective and user-friendly bacterial detection techniques.",
            "Committed to bridging scientific innovation with real-world applications for safe and sustainable water resources."
        ]
    },
    {
        name: "Sanjeet Athawale",
        designation: "Product manager",
        image: "/sanjeet.jpg",
        details: [
            "B.tech 4th year student at IIT Jodhpur.",
            "Pursuing a major in Electrical Engineering.",
            "Experienced in product management and development.",
            "Skilled in market research, user experience design, and project coordination."
        ]
    },
    {
        name: "Satyam Sharma",
        designation: "Sales/Marketing Lead",
        image: "/Asset.png",
        details: [
           "B.tech 4th year student at IIT Jodhpur.",
            "Pursuing a major in Computer science Engineering.",
            "Experienced in sales and marketing strategies.",
            "Skilled in digital marketing, customer engagement, and brand promotion."
        ]
    }
];

export default function Team({ isMobile }) {
    return (
        <Box sx={{ py: 6, px: { xs: 2, md: 4 }, background: 'linear-gradient(135deg, #FFFFFF, #E0F2F1)' }}>
            <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    color: "#333",
                    mb: 4,
                    borderBottom: "2px solid #00BCD4",
                    display: "inline-block",
                    pb: 1
                }}
            >
                Our Team
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {teamMembers.map((member, index) => (
                    <Grid item xs={12} md={6} key={index} sx={{ display: "flex" }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: "#ffffff",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                flex: 1,
                                minHeight: { xs: 350, md: 310 }, // 350px for small screens, 310px for larger screens (reduced by 40px)
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
                                }
                            }}
                        >
                            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center" }}>
                                <Avatar
                                    src={member.image}
                                    alt={member.name}
                                    sx={{
                                        width: isMobile ? 150 : 200,
                                        height: isMobile ? 150 : 200,
                                        mb: isMobile ? 2 : 0,
                                        mr: isMobile ? 0 : 3,
                                        transition: "transform 0.3s ease",
                                        "&:hover": { transform: "scale(1.05)" }
                                    }}
                                />
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 600, color: "#00BCD4", mb: 0.5 }}
                                    >
                                        {member.name}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ color: "#555", mb: 2 }}
                                    >
                                        <strong>{member.designation}</strong>
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2, backgroundColor: "#ddd" }} />
                            <List dense disablePadding>
                                {member.details.map((detail, idx) => (
                                    <ListItem key={idx} sx={{ py: 0.5, alignItems: "flex-start" }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10, color: "#00BCD4", mt: "6px", mr: 1 }} />
                                        <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.6 }}>
                                            {detail}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
