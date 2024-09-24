import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import renderRoutes from './routes/Router';
import { baselightTheme } from "./theme/DefaultColors";
import { useContext, useEffect, useState } from 'react';
import storeContext from './store/context'
function App() {
   const [role, setRole] = useState(null);
  const [state] = useContext(storeContext);

  // Kiểm tra trước khi truy cập state.user và state.user.role
  useEffect(() => {
    if (state?.user?.role) {
      setRole(state.user.role);
    }
  }, [state?.user?.role]);

  const user = JSON.parse(localStorage.getItem('user'));

  // Kiểm tra role của user trước khi sử dụng
  const routing = useRoutes(renderRoutes(user?.role || role));
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

export default App;


