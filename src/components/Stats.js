"use client";
import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FadeInSection from './FadeInSection';

const statsData = [
  // { label: 'Samples Tested', value: 1200 },
  // { label: 'Locations Monitored', value: 25 },
  // { label: 'Users Engaged', value: 500 },
];

export default function Stats() {
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const timers = statsData.map((stat, idx) => {
      const increment = Math.ceil(stat.value / 50);
      return setInterval(() => {
        setCounts((prev) => {
          const next = [...prev];
          if (next[idx] < stat.value) {
            next[idx] = Math.min(stat.value, next[idx] + increment);
          }
          return next;
        });
      }, 30);
    });
    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <FadeInSection>
      <Box
        sx={{
          py: 6,
          background: 'linear-gradient(135deg, #FFFFFF, #E0F2F1)',
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {statsData.map((stat, idx) => (
            <Grid item xs={4} sm={3} key={stat.label} textAlign="center">
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {counts[idx]}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </FadeInSection>
  );
}
