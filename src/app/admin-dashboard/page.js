"use client";
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Alert,
    useMediaQuery,
    useTheme,
    keyframes
} from "@mui/material";
import { Palette, Home } from "@mui/icons-material";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rowEnter = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export default function AdminDashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchContacts() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/get-all-contacts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setContacts(data.contacts || []);
                } else {
                    setError(data.message || "Failed to fetch contacts");
                }
            } catch (error) {
                console.error("Error:", error);
                setError("Something went wrong while fetching contacts.");
            } finally {
                setLoading(false);
            }
        }
        fetchContacts();
    }, []);

    const handleBackToHome = () => {
        window.location.href = "/";
    };

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                animation: `${fadeIn} 0.5s ease-out`
            }}>
                <CircularProgress sx={{ color: '#3F51B5' }} size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 4,
                animation: `${fadeIn} 0.5s ease-out`
            }}>
                <Alert severity="error" sx={{
                    mb: 2,
                    width: isMobile ? '90%' : '50%',
                    boxShadow: 3,
                    borderRadius: 2
                }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    onClick={handleBackToHome}
                    startIcon={<Home />}
                    sx={{
                        bgcolor: '#3F51B5',
                        '&:hover': { bgcolor: '#303F9F' },
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: 3,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    Back to Home
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: isMobile ? 2 : 4,
            animation: `${fadeIn} 0.5s ease-out`
        }}>
            <Typography variant="h4" gutterBottom sx={{
                fontWeight: 700,
                color: '#2C3E50',
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <Palette fontSize="large" />
                Contact Management Dashboard
            </Typography>

            <TableContainer
                component={Paper}
                elevation={3}
                sx={{
                    borderRadius: 3,
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { height: '8px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#3F51B5', borderRadius: 2 }
                }}
            >
                <Table sx={{ minWidth: isMobile ? 600 : 'unset' }}>
                    <TableHead sx={{
                        bgcolor: 'primary.main',
                        background: 'linear-gradient(45deg, #3F51B5 30%, #303F9F 90%)'
                    }}>
                        <TableRow>
                            {['Name', 'Email', 'Phone', 'Subject', 'Message', 'Received At'].map((header) => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        color: 'common.white',
                                        fontWeight: 'bold',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                        py: 2,
                                        borderRight: '1px solid rgba(255,255,255,0.1)',
                                        '&:last-child': { borderRight: 0 }
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact, index) => (
                            <TableRow
                                key={contact._id}
                                sx={{
                                    animation: `${rowEnter} 0.3s ease-out ${index * 0.05}s`,
                                    '&:hover': { bgcolor: '#F5F6FA' },
                                    transition: 'background-color 0.2s ease',
                                    '&:nth-of-type(odd)': { bgcolor: '#F9FAFC' }
                                }}
                            >
                                <TableCell sx={{
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    py: 1.5
                                }}>
                                    {contact.name}
                                </TableCell>
                                <TableCell sx={{
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    py: 1.5
                                }}>
                                    {contact.email}
                                </TableCell>
                                <TableCell sx={{
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    py: 1.5
                                }}>
                                    {contact.phone || "—"}
                                </TableCell>
                                <TableCell sx={{
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    py: 1.5
                                }}>
                                    {contact.subject || "—"}
                                </TableCell>
                                <TableCell sx={{
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    py: 1.5,
                                    maxWidth: 250,
                                    wordBreak: 'break-word'
                                }}>
                                    {contact.message}
                                </TableCell>
                                <TableCell sx={{
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    py: 1.5
                                }}>
                                    {new Date(contact.createdAt).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                animation: `${fadeIn} 0.5s ease-out`
            }}>
                <Button
                    variant="contained"
                    onClick={handleBackToHome}
                    startIcon={<Home />}
                    sx={{
                        bgcolor: '#3F51B5',
                        '&:hover': {
                            bgcolor: '#303F9F',
                            transform: 'scale(1.05)'
                        },
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: 3,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    Back to Home
                </Button>
            </Box>
        </Box>
    );
}