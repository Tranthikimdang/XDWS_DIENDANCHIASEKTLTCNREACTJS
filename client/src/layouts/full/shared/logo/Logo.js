import { Link } from 'react-router-dom';
import favicon from 'src/assets/images/logos/favicon.png';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '150px',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
}));

const LogoImage = styled('img')(() => ({
  height: '70px',
  marginRight: '0',
}));

const LogoText = styled('span')({
  fontSize: '24px',
  fontWeight: 'bold',
  marginLeft: '0px',
  color: '#11142D', // Adjust the color as needed
  whiteSpace: 'nowrap', // Prevents text from wrapping
  display: 'flex', // Aligns text on the same line as the image
  alignItems: 'center', // Vertically center text with the image
});

const Logo = () => {
  return (
    <LinkStyled to="/">
      <LogoImage src={favicon} alt="Logo" />
      <LogoText>Share code</LogoText>
    </LinkStyled>
  );
};

export default Logo;
