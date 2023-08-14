// App.js

import DownloadButton from './DownloadButton';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Container, CssBaseline, Paper } from '@mui/material';
import UploadButton from './UploadButton'; // Adjust the path to the actual location of your FileUploader component

const App = () => {
  const fileLink = 'http://localhost:3000/2342343422342342313.mp3';

  return (
    <>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <div className="app">
            <h1>File Download with Progress Bar</h1>
            <DownloadButton url={fileLink} filename="eminem.mp3" />
          </div>
          <UploadButton />
        </Paper>
      </Container>
    </>
  );
};

export default App;
