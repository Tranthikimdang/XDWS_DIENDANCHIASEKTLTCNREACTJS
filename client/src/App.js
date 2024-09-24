import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import renderRoutes from './routes/Router';
import { baselightTheme } from "./theme/DefaultColors";
import { useContext, useEffect, useState } from 'react';
import storeContext from './store/context'
function App() {
  console.log(storeContext);
  const [role, setRole] = useState(null)

  const [state] = useContext(storeContext)
  console.log(state);

  useEffect(() => {
    setRole(state.user.role)
  }, [state.user.role])
  const user = JSON.parse(localStorage.getItem('user'))

  const routing = useRoutes(renderRoutes(user.role));
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

export default App;


