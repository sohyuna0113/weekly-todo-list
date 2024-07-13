import React from 'react';
import styled from 'styled-components';

interface TextProps {
  children: React.ReactNode;
}

const StyledText = styled.div`
  font-size: 0.8em;
  color: #333;
  margin-left: 5px;
  margin-bottom: 5px;
`;

const Text: React.FC<TextProps> = ({ children }) => {
  return <StyledText>{children}</StyledText>;
};

export default Text;
