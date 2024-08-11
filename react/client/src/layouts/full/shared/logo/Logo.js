import { Link } from 'react-router-dom';
import favicon from 'src/assets/images/logos/favicon.png';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '150px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
}));

const LogoImage = styled('img')(() => ({
  height: '70px',
}));

const LogoText = styled('span')(() => ({
  fontSize: '24px',
  fontWeight: 'bold',
  marginLeft: '10px',
  color: '#11142D', // You can adjust the color as needed
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <LogoImage src={favicon} alt="Logo" />
      <LogoText>Share code</LogoText>
    </LinkStyled>
  );
};

export default Logo;
