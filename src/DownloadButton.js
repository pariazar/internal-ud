import React, { useState, useCallback } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DoneIcon from '@mui/icons-material/Done';
import { SpinningCircularProgress } from './SpinningCircularProgress';

const DownloadButton = ({ url, filename }) => {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [fileSize, setFileSize] = useState(0);

  const downloadFile = useCallback(async () => {
    try {
      setIsDownloading(true);

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentage);

          if (!fileSize) {
            // If the file size is not set, try to retrieve it from the response headers
            const contentLength = progressEvent.total;
            setFileSize(Math.round(contentLength / 1024)); // Convert to KB
          }
        },
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);

      setDownloadComplete(true);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  }, [url, filename, fileSize]);

  const formattedCurrentSize =
    fileSize >= 1024 ? `${(fileSize / 1024).toFixed(2)} MB` : `${fileSize} KB`;

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
      ) : downloadComplete ? (
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
          {Math.round(progress)}% - {formattedCurrentSize}
        </span>
      )}
    </div>
  );
};

export default DownloadButton;
