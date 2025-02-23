// components/FloatingActionButton.js
import React from 'react';
import { Fab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // The search icon

const FloatingActionButton = ({onClick}) => {
  return (
    <Fab
      color="default"
      size="medium"
      aria-label="search"
      onClick={onClick}
      sx={{
        position: 'fixed',
        top: 30, // Distance from the bottom of the screen
        right: 20,  // Distance from the right of the screen
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

export default FloatingActionButton;
