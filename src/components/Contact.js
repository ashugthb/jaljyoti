"use client";
import { useState } from "react";
import { toast } from 'react-toastify';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from "@mui/material";

export default function Contact() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Something went wrong");
            } else {
                toast.success(data.message || "Message sent successfully");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
        setLoading(false);
    };

    return (
        <>
            {/* Initial "Send Message" Button */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        backgroundColor: "#004D40", // Dark Teal
                        transition: "transform 0.3s ease, background-color 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.03)",
                            backgroundColor: "#00695C", // Lighter dark teal
                        },
                    }}
                >
                    Send Message
                </Button>
            </Box>

            {/* Dialog Form */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        p: 2,
                        boxShadow: "0px 4px 16px rgba(0,0,0,0.3)",
                        backgroundColor: "#ECEFF1", // Light background for contrast
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.6rem",
                        borderBottom: "2px solid #004D40", // Dark Teal accent
                        pb: 1,
                        mb: 2,
                        color: "#004D40",
                    }}
                >
                    Contact Us
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} id="contact-form">
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size="small"
                                    sx={{ mb: 1 }}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size="small"
                                    sx={{ mb: 1 }}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="phone"
                                    label="Phone Number"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    sx={{ mb: 1 }}
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="subject"
                                    label="Subject"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    sx={{ mb: 1 }}
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="message"
                                    label="Message"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    required
                                    size="small"
                                    sx={{ mb: 1 }}
                                    value={formData.message}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            borderColor: "#004D40",
                            color: "#004D40",
                            transition: "transform 0.3s ease, background-color 0.3s ease",
                            "&:hover": { backgroundColor: "#004D40", color: "#fff" },
                            px: 3,
                            py: 1,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="contact-form"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: "#004D40",
                            color: "#fff",
                            transition: "transform 0.3s ease, background-color 0.3s ease",
                            "&:hover": { backgroundColor: "#00695C" },
                            px: 3,
                            py: 1,
                        }}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
