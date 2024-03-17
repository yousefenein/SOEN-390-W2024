
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  CardMedia,
} from "@mui/material";
import { Card } from "@mui/joy";
import Grid from "@mui/joy/Grid";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom"; // Make sure to import useNavigate
import { useEffect, useState } from "react";
import { SelectChangeEvent } from '@mui/material/Select';

function CreateRequestPage() {

  const navigate = useNavigate(); // Initialize useNavigate

 
  const [formData, setFormData] = useState({
    requestType: "",
    date: "",
    time: "",
    requestReason: "",
    priority:"",
    createdBy:"",
    
  });


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const isSelectEvent = (event: any): event is SelectChangeEvent<string> => 'target' in event && 'value' in event.target;
    
    let name: string, value: string;
    
    if (isSelectEvent(event)) {
      name = event.target.name;
      value = event.target.value as string; // For Select, value is already a string.
    } else {
      name = event.target.name;
      value = event.target.value;
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //checking if you are logged in or not
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Request data submitted successfully");
        setFormData({
          requestType: "",
          date: "",
          time: "",
          requestReason: "",
          priority: "",
          createdBy:"",
        });
      } else {
        const errorResponse = await response.text(); // Or response.json() if the server responds with JSON
        console.error("Failed to submit data", errorResponse);
      }
      
    } catch (error) {
      console.error("Error submitting listing data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    const role = localStorage.getItem("role");
    if (role !== 'publicUser'){
      navigate("/dashboard-company")
    }
  }, []);
  return (
    <>
      <Navbar />
      <Container sx={{ mt: 10 }}>
        <Card variant="soft">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CardMedia
              component="img"
              image="https://accescondos.org/app/uploads/2016/09/fc6_persp_principale.jpg"
              alt="Complex"
              sx={{ maxWidth: "50%", maxHeight: "100%" }} // This ensures the image does not exceed its container
            />
          </Box>

          <Typography component="div">
            <Box sx={{ fontSize: 30, m: 1, textAlign: "center" }}>
              36 Lee drive, H8B 3M6
            </Box>
          </Typography>

          <form noValidate autoComplete="off">
            <Grid container spacing={2} alignItems="flex-end">
              <Grid xs={6} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id="requestType">Request type</InputLabel>
                  <Select
                    labelId="requestType"
                    name="requestType"
                    label="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                  >
                    <MenuItem value="Moving out">Moving out - Elevator</MenuItem>
                    <MenuItem value="IntercomChanges">Intercom Changes</MenuItem>
                    <MenuItem value="ReportingViolation">Reporting a violation</MenuItem>
                    <MenuItem value="inquiry">Deficiency in common areas</MenuItem>
                    <MenuItem value="Reservation">Make Reservation</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={6} sm={3}>
                <FormControl fullWidth>
                  <InputLabel id="priority">Priority</InputLabel>
                  <Select
                    labelId="priority"
                    name="priority"
                    label="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                   
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={6} sm={2}>
                <TextField
                  name="date"
                  label="Date"
                  type="date"
                  variant="filled"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.date}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={6} sm={2}>
                <TextField
                  name="time"
                  label="Time"
                  type="time"
                  variant="filled"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.time}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={6} sm={2}>
                <TextField
                  name="createdBy"
                  label="createdBy"
                  type="text"
                  variant="filled"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.createdBy}
                  onChange={handleChange}
                />
              </Grid>
              
            </Grid>
            <TextField
              name="requestReason"
              label="Reason for request"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={formData.requestReason}
              onChange={handleChange}
            />
            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Card>
      </Container>
    </>
  );
}

export default CreateRequestPage;