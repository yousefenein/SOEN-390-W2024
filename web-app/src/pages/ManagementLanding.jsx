import React from 'react';
import NavbarLogOut from '../components/NavbarLogOut';
import { createTheme, ThemeProvider, CssBaseline, Box, Typography, Divider, Container, Grid, ButtonBase } from '@mui/material';
import "../App.css";

const defaultTheme = createTheme({});

const SectionBox = ({ title, children, onClick }) => (
  <ButtonBase onClick={onClick} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{
      padding: 2, 
      border: '2px solid orange', 
      borderRadius: '4px', 
      flexGrow: 1, 
      margin: 1,
      boxShadow: '0 4px 6px rgba(128, 128, 128, 0.6)', // Grey shadow
      '&:hover': {
        boxShadow: '0 6px 8px rgba(128, 128, 128, 0.8)', // Enhance shadow on hover
        borderColor: 'darkorange', // Darken border on hover for visual feedback
      },
      transition: 'box-shadow 0.3s ease, border-color 0.3s ease', // Smooth transition for shadow and border color
    }}>
      <Typography variant="h6" gutterBottom component="div">
        {title}
      </Typography>
      <Divider />
      <Typography variant="body1" component="div">
        {children}
      </Typography>
    </Box>
  </ButtonBase>
);

const ManagementLanding = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <div className="home-background">
        <NavbarLogOut />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 64px)', 
          paddingTop: 3,
        }}>
          <Container maxWidth="md">
            <Box sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: 3,
              width: '100%',
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Typography variant="h4" sx={{ my: 4 }}>
                Welcome, Condo Management User!
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <SectionBox title="Property Dashboard" onClick={() => console.log('Property Dashboard clicked')}>
                    This section could include an employee list and request management features.
                  </SectionBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SectionBox title="Manage Condo Files" onClick={() => console.log('Manage Condo Files clicked')}>
                    Here you can manage and access condo-related documents and files.
                  </SectionBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SectionBox title="Financial System" onClick={() => console.log('Financial System clicked')}>
                    Overview of financial operations, such as billing, payments, and budgeting.
                  </SectionBox>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SectionBox title="Reservation System" onClick={() => console.log('Reservation System clicked')}>
                    Residents can book amenities and services available in the condo.
                  </SectionBox>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default ManagementLanding;
