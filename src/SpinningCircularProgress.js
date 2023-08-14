import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { CircularProgress } from '@mui/material';

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
export const SpinningCircularProgress = styled(CircularProgress)`
  animation: ${spin} 2s linear infinite; /* Customize animation duration and timing function */
`;
