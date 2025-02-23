import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';  // Updated the icon to Add
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';  // Import useRouter from next/router

const BottomNavigationBar = ({ onSearchClick }) => {
  const [value, setValue] = useState(0);
  const router = useRouter();  // Initialize useRouter hook

  // Update the selected value based on the current route
  useEffect(() => {
    if (router.pathname === '/') {
      setValue(0);  // Home page
    } else if (router.pathname === '/downloadpage') {
      setValue(2);  // Profile page
    } else {
      setValue(1);  // Add page or any other page
    }
  }, [router.pathname]);  // Re-run when pathname changes

  const handleHomeClick = () => {
    router.push('/');  // Navigate to the index page
  };

  const handleProfileClick = () => {
    router.push('/downloadpage');  // Navigate to the download page
  };

  const handleAddClick = () => {
    // Optionally, you can define what happens when the Add icon is clicked
    // For now, it won't change the route since it's always highlighted
    onSearchClick();
  };

  return (
    <BottomNavigation
      value={value}  // Set value to reflect the current route
      onChange={(event, newValue) => setValue(newValue)}  // Handle value change
      showLabels
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 100,
        bgcolor: 'background.paper',
        boxShadow: 1,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        py: 4.3,
      }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        onClick={handleHomeClick}  // Handle home click
        sx={{
          '&.Mui-selected': {
            color: '#0d9488',  // Highlight color
          },
        }}
      />
      <BottomNavigationAction
  label="Add"
  icon={<AddIcon />}
  onClick={handleAddClick}
  disabled={true}  // Disables interaction with the Add button
  sx={{
    '&.Mui-selected': {
      backgroundColor: '#0d9488',  // Teal background when selected
      color: '#ffffff',  // White color for the icon when selected
      borderRadius: '12px',  // Small rounded corners
      padding: '6px',  // Padding to ensure the icon fits well inside the box
    },
    // Disable the Add icon
    opacity: 0,  // Make the Add icon fully transparent
    pointerEvents: 'none',  // Prevent interaction with the Add icon
    color: '#0d9488',  // Teal color
    backgroundColor: '#0d9488',  // Keep background color consistent
    borderRadius: '12px',
    padding: '6px',
  }}
/>
      <BottomNavigationAction
        label="Profile"
        icon={<AccountCircleIcon />}
        onClick={handleProfileClick}  // Handle profile click
        sx={{
          '&.Mui-selected': {
            color: '#0d9488',  // Highlight color
          },
        }}
      />
    </BottomNavigation>
  );
};

export default BottomNavigationBar;
