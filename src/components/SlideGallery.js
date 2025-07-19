import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SlideGallery({ slides = [] }) {
  if (!slides.length) return null;
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', py: 8 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Presentation Slides
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        {slides.map((src, idx) => (
          <Box
            key={idx}
            component="img"
            src={src}
            alt={`Slide ${idx + 1}`}
            sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
          />
        ))}
      </Box>
    </Box>
  );
}

