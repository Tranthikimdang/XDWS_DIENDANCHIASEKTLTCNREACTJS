import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import renderRoutes from './routes/Router';
import { baselightTheme } from "./theme/DefaultColors";
import { useContext, useEffect, useState } from 'react';
import storeContext from './store/context'
import { VisionUIControllerProvider } from './context';
function App() {
  const [role, setRole] = useState(null)

  const [state] = useContext(storeContext)

  useEffect(() => {
    setRole(state.user.role)
  }, [state.user.role])
  const user = JSON.parse(localStorage.getItem('user'))

  const routing = useRoutes(renderRoutes('admin'));
  const theme = baselightTheme;

  return (
    <ThemeProvider theme={theme}>
      <VisionUIControllerProvider>
      <CssBaseline />
      {routing}
      </VisionUIControllerProvider>
    </ThemeProvider>
  );
}

export default App;


