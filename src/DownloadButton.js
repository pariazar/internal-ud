import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DoneIcon from '@mui/icons-material/Done';

// Define the spinning animation using keyframes
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Create a styled component with the spinning animation
const SpinningCircularProgress = styled(CircularProgress)`
  animation: ${spin} 2s linear infinite; /* Customize animation duration and timing function */
`;

const DownloadButton = ({ url, filename, fileSize }) => {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setProgress(0);
        setDownloadComplete(true);
      }, 1000); // Reset progress after completion (1 second delay)
    }
  }, [progress]);
  const downloadFile = async () => {
    try {
      setIsDownloading(true); // Set downloading state
      setProgress(1); // Start the progress animation

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentage);
        },
      });

      setIsDownloading(false); // Reset downloading state
      setProgress(0); // Reset progress animation

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      setIsDownloading(false);

      console.error('Error downloading file:', error);
    }
  };

  // Calculate the current downloaded size based on progress
  const currentDownloadedSize = Math.round((fileSize * progress) / 100);
  // Calculate the remaining size
  const remainingSize = fileSize; // - currentDownloadedSize;

  // Convert the sizes to KB or MB as appropriate
  const formattedCurrentSize =
    currentDownloadedSize >= 1024
      ? `${(currentDownloadedSize / 1024).toFixed(2)} MB`
      : `${currentDownloadedSize} KB`;

  const formattedRemainingSize =
    remainingSize >= 1024
      ? `${(remainingSize / 1024).toFixed(2)} MB`
      : `${remainingSize} KB`;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {isDownloading ? (
        <SpinningCircularProgress
          size={60}
          color="primary"
          variant="determinate"
          value={progress}
        />
      ) : // Conditionally render based on download completion
      downloadComplete ? (
        <DoneIcon color="primary" fontSize="large" />
      ) : (
        <IconButton
          aria-label="download"
          onClick={downloadFile}
          style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px' }}
        >
          <CloudDownloadIcon fontSize="large" />
        </IconButton>
      )}

      {progress > 0 && (
        <span style={{ marginLeft: '10px' }}>
          {Math.round(progress)}% - {formattedCurrentSize} /{' '}
          {formattedRemainingSize}
        </span>
      )}
    </div>
  );
};

export default DownloadButton;
