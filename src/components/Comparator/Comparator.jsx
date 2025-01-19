import {
  Box,
  Container,
  Typography,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Alert,
  AlertTitle,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import { fetchPokemon, fetchPokemonInBatches } from "../../Api/api";
import { Link } from "react-router-dom";

function Comparator() {
  const [pokemons, setPokemons] = useState([]);
  const [firstpokemon, setFirstPokemon] = useState([]);
  const [secondpokemon, setSecondPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pokemonDetails, setPokemonDetails] = useState({
    first: null,
    second: null,
  });

  // Estado para las alertas
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const getPokemons = async () => {
      try {
        const listpokemons = await fetchPokemon();
        const pokemonwithDetails = await fetchPokemonInBatches(listpokemons);
        setPokemons(pokemonwithDetails);
      } catch (error) {
        alert("Error al obtener los pokemones");
        throw error;
      }
    };
    getPokemons();
  }, []);

  useEffect(() => {
    const getPokemonDetails = async () => {
      if (firstpokemon) {
        try {
          const res1 = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${firstpokemon.name}`
          );
          const data1 = await res1.json();
          setPokemonDetails((prev) => ({
            ...prev,
            first: data1, // Guardar detalles del primer Pokémon
          }));
        } catch (error) {
          console.log("Error al obtener detalles de", firstpokemon.name);
        }
      }
      if (secondpokemon) {
        try {
          const res2 = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${secondpokemon.name}`
          );
          const data2 = await res2.json();
          setPokemonDetails((prev) => ({
            ...prev,
            second: data2, // Guardar detalles del segundo Pokémon
          }));
        } catch (error) {
          console.log("Error al obtener detalles de", secondpokemon.name);
        }
      }
    };

    getPokemonDetails();
  }, [firstpokemon, secondpokemon]);

  const handlePokemonSelection = (pokemon) => {
    if (firstpokemon.length === 0) {
      setFirstPokemon(pokemon);
      setAlertMessage(`Tu primer Pokémon seleccionado: ${pokemon.name}`);
    } else if (secondpokemon.length === 0) {
      setSecondPokemon(pokemon);
      setAlertMessage(`Tu segundo Pokémon seleccionado: ${pokemon.name}`);
    } else {
      setAlertMessage("Ya seleccionaste ambos Pokémon.");
    }

    setShowAlert(true); // Mostrar la alerta
    setTimeout(() => setShowAlert(false), 3000); // Ocultar la alerta después de 3 segundos
  };

  const filterPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mostrar alerta */}
      {showAlert && (
        <Alert
          severity="success"
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Centrar horizontal y verticalmente
            zIndex: 1000,
            width: "80%", // Ajusta el ancho según tus necesidades
            maxWidth: "400px", // Limitar el ancho máximo
            textAlign: "center",
          }}
        >
          <AlertTitle>Seleccionado</AlertTitle>
          {alertMessage}
        </Alert>
      )}

      {pokemonDetails.first && pokemonDetails.second ? (
        <Container>
          <Button
            variant="contained"
            onClick={() => {
              setPokemonDetails({
                first: null,
                second: null,
              });
              setFirstPokemon([]);
              setSecondPokemon([]);
            }}
          >
            Regresar
          </Button>

          <Box>
            <Typography variant="h6">Comparando</Typography>
            <Typography>
              {pokemonDetails.first.name} y {pokemonDetails.second.name}
            </Typography>
          </Box>
          <Box
            sx={{ display: { xs: "block", sm: "flex" } }}
            justifyContent={"center"}
          >
            <Card sx={{ width: "15rem", margin: { xs: "3px", sm: "40px" } }}>
              <CardMedia
                component="img"
                alt={pokemonDetails.first.name}
                image={firstpokemon.img}
                height="200"
              />
              <CardContent>
                {pokemonDetails.first.stats.map((statpokemon, index) => (
                  <Typography key={index}>
                    {statpokemon.stat.name}: {statpokemon.base_stat}
                  </Typography>
                ))}
              </CardContent>
            </Card>
            <Card sx={{ width: "15rem", margin: { xs: "3px", sm: "40px" } }}>
              <CardMedia
                component="img"
                alt={pokemonDetails.second.name}
                image={secondpokemon.img}
                height="200"
              />
              <CardContent>
                {pokemonDetails.second.stats.map((statpokemon, index) => (
                  <Typography key={index}>
                    {statpokemon.stat.name}: {statpokemon.base_stat}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Container>
      ) : (
        <Container>
          <Box
            sx={{
              display: { xs: "block", sm: "flex" },
              justifyContent: "flex-start",
            }}
          >
            <Link to="/">
              <Button variant="contained">Regresar</Button>
            </Link>
          </Box>
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography variant="h4" gutterBottom>
              Selecciona los 2 pokemons a comparar
            </Typography>
            <TextField
              label="Buscar Pokemon"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 10 }}
            ></TextField>
            <Grid container spacing={4}>
              {filterPokemons.length > 0 ? (
                filterPokemons.map((pokemon) => (
                  <Grid item xs={12} sm={6} md={4} key={pokemon.name}>
                    <Card
                      onClick={() => handlePokemonSelection(pokemon)}
                      sx={{
                        transition: "transform 0.3 ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0px 10px 20px rgba(0,0,0,0.6)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt={pokemon.name}
                        height="200"
                        image={pokemon.img}
                      />
                      <CardContent>
                        <Typography variant="h6">{pokemon.name}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="h6">
                  No se encontraron pokemones con ese nombre
                </Typography>
              )}
            </Grid>
          </Box>
        </Container>
      )}
    </>
  );
}

export default Comparator;
