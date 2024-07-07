import React from 'react';
import styled from 'styled-components';

interface SubtitleProps {
    children: React.ReactNode;
}

const StyledSubtitle = styled.div`
    font-size: 2em;
    color: #333;
    margin-bottom: 20px;
`;

const Subtitle: React.FC<SubtitleProps> = ({children}) => {
    return <StyledSubtitle>{children}</StyledSubtitle>
}

export default Subtitle;