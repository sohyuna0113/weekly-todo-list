import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
}

const StyledContainer = styled.div`
  padding: 50px;
  margin: 50px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
`;

const Container: React.FC<ContainerProps> = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

export default Container;
