import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
} from "@mui/material";
import { fetchPokemon, fetchPokemonInBatches } from "../../Api/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [pokemons, setPokemones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getPokemons = async () => {
      try {
        const pokemonslist = await fetchPokemon();
        const pokemonsWithDetails = await fetchPokemonInBatches(pokemonslist);
        setPokemones(pokemonsWithDetails);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    };
    getPokemons();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Container>
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Pokémon Listados
          </Typography>
          <TextField
            label="Buscar Pokemon"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 10 }}
          ></TextField>

          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={4}>
              {filteredPokemons.length > 0 ? (
                filteredPokemons.map((pokemon) => (
                  <Grid item xs={12} sm={6} md={4} key={pokemon.name}>
                    <Link to={`/pokemon/${pokemon.name}`}>
                      <Card
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
                    </Link>
                  </Grid>
                ))
              ) : (
                <Typography variant="h6">
                  No se encontraron pokemones con ese nombre
                </Typography>
              )}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
}
export default Home;
