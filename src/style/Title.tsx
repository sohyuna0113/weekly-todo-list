import React from 'react';
import styled from 'styled-components';

interface TitleProps {
    children: React.ReactNode;
}

const StyledTitle = styled.div`
    font-size: 4em;
    color: #333;
`;

const Title: React.FC<TitleProps> = ({children}) => {
    return <StyledTitle>{children}</StyledTitle>
}

export default Title;
