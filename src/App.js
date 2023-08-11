// App.js

import DownloadButton from './DownloadButton';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [fileSize, setFileSize] = useState(0);
  const fileLink =
    'http://65.186.78.52/MUSIC/Cheryl/Amy%20Grant/20th%20Century%20Masters_%20The%20Best%20of%20Amy%20Grant_%20The%20Christmas%20Collection/09%20I%e2%80%99ll%20Be%20Home%20for%20Christmas.mp3';
  useEffect(() => {
    const fetchFileSize = async () => {
      try {
        const response = await axios.head(fileLink);
        const contentLength = response.headers['content-length'];
        setFileSize(Math.round(contentLength / 1024)); // Convert to KB
      } catch (error) {
        console.error('Error fetching file size:', error);
      }
    };
    fetchFileSize();
  }, []);

  return (
    <>
      <div className="app">
        <h1>File Download with Progress Bar</h1>
        <DownloadButton
          url={fileLink}
          filename="eminem.mp3"
          fileSize={fileSize}
        />
      </div>
    </>
  );
};

export default App;
