
// LoginPage.js
import { useState } from "react";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import FitbitIcon from "@mui/icons-material/Fitbit";
import UserLoginForm from "../Authentication/UserLoginForm";
import CompanyLoginForm from "../Authentication/CompanyLoginForm";


const LoginPage = () => {
  const [role, setRole] = useState("");
  

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };
  

  return (
    <>
      <Navbar /> {/* Render the Navbar component */}
      <div style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Box

          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "salmon" }}>
            <FitbitIcon />
          </Avatar>

          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 2 }}></Box>
          <div className="form-group">
            <label htmlFor="role">I am a: </label>
            <select name="role" onChange={handleRoleChange}>
              <option value="user">Public User</option>
              <option value="company">Company</option>
            </select>
          </div>

          {role === "company" ? <CompanyLoginForm /> : <UserLoginForm />}

          <Grid container justifyContent={"center"}>
            <Grid item>
              <Link to="/Signup">Don't have an account? Register</Link>
            </Grid>
          </Grid>

        </Box>
      </div>
    </>
  );
};

export default LoginPage;
