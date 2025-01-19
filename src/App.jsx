import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home/home";
import Comparator from "./components/Comparator/Comparator";

import PokemonDetails from "./components/PokemonDetails/PokemonDetails";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  MenuItem,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Ícono de hamburguesa

function App() {
  // Estado para controlar el menú desplegable
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Función para abrir/cerrar el menú (Drawer)
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Router>
      {/* AppBar con menú de hamburguesa */}
      <AppBar position="sticky">
        <Toolbar>
          <Box display="flex" justifyContent="space-between" width="100%">
            {/* Título de la app */}
            <Box justifyContent={"flex-start"}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                <Link to="/"> Pokemon </Link>
              </Typography>
            </Box>

            {/* Ícono de menú de hamburguesa (para pantallas pequeñas) */}
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              sx={{ display: { xs: "block", sm: "none" } }} // Solo visible en pantallas pequeñas
            >
              <MenuIcon />
            </IconButton>

            {/* Enlaces de navegación visibles solo en pantallas grandes */}
            <Box display={{ xs: "none", sm: "flex" }} flexDirection="row">
              <Typography variant="h6" sx={{ padding: 1 }}>
                <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                  Home
                </Link>
              </Typography>
              <Typography variant="h6" sx={{ padding: 1 }}>
                <Link
                  to="/comparator"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Comparator
                </Link>
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú de hamburguesa (Drawer) */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
          {/* Enlaces del menú móvil */}
          <MenuItem>
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              Home
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              to="/comparator"
              style={{ textDecoration: "none", color: "black" }}
            >
              Comparator
            </Link>
          </MenuItem>
        </Box>
      </Drawer>

      {/* Contenedor principal donde manejas las rutas */}
      <main className="max-w-[1280px] m-auto p-[2rem] text-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comparator" element={<Comparator />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
