// components/FloatingActionButton.js
import React from 'react';
import { Fab } from '@mui/material';
import SearchIcon from '@mui/icons-material/SettingsBackupRestore'; // The search icon

const ResetActionButton = ({onClick}) => {
  return (
    <Fab
      color="default"
      size="medium"
      aria-label="search"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 15, // Distance from the bottom of the screen
        left: '50%',  // Center horizontally
        transform: 'translateX(-50%)', // Adjust to make sure it's exactly centered
        zIndex: 1000, // Make sure it's above other elements
        backgroundColor: '#f9f9f9', // Off-white background color
        color: 'black', // Black icon color
        borderRadius: '12px', // Set the border radius to 12px
        boxShadow: 'none', // Remove the shadow
        '&:hover': {
          backgroundColor: '#e0e0e0', // Light grey for hover state
        },
        '&:active': {
          backgroundColor: '#d0d0d0', // Slightly darker for active state
        },
      }}
    >
      <SearchIcon />
    </Fab>
  );
};

export default ResetActionButton;
