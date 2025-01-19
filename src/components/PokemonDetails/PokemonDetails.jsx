import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
function PokemonDetails() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    const fetchpokemon = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          throw new Error("No se pudo obtener el Pokémon");
        }
        const data = await response.json();
        setPokemon(data); // Guardamos los datos del Pokémon

        // Inicia un fetch para las ubicaciones
        if (data.location_area_encounters) {
          const locationResponse = await fetch(data.location_area_encounters);
          if (!locationResponse.ok) {
            throw new Error("No se pudieron obtener las ubicaciones");
          }
          const locationData = await locationResponse.json();
          setLocation(locationData); // Guardamos las ubicaciones
        }
      } catch (error) {
        console.error("Error al obtener el Pokémon:", error);
      }
    };
    fetchpokemon();
  }, [id]);

  if (!pokemon) {
    return (
      <Typography variant="h6" color="error">
        Pokémon no encontrado
      </Typography>
    );
  }
  return (
    <>
      <Card
        sx={{
          display: { xs: "block", sm: "flex" },
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardMedia
            image={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            style={{
              width: "300px",
              height: "300px",
            }}
          />
        </Box>
        <Box>
          <CardContent
            sx={{ display: { xs: "block", sm: "flex" }, flexDirection: "row" }}
          >
            <Box sx={{ padding: "2rem" }}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="details-content"
                  id="details-header"
                >
                  <Typography variant="body1">Detalles del Pokemon</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">
                    Peso: {pokemon.weight}
                  </Typography>
                  <Typography variant="body1">
                    Altura: {pokemon.height}
                  </Typography>
                  <Typography variant="body1">Tipos:</Typography>
                  <ul>
                    {pokemon.types.map((typeInfo) => (
                      <li key={typeInfo.type.name}>{typeInfo.type.name}</li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </Box>
            <Box sx={{ padding: "2rem" }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="abilities-content"
                  id="abilities-header"
                >
                  <Typography variant="body1">Habilidades</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    {pokemon.abilities.map((abilitiesinfo) => (
                      <li key={abilitiesinfo.ability.name}>
                        {abilitiesinfo.ability.name}
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </Box>
            <Box sx={{ padding: "2rem" }}>
              <Accordion>
                {/* Encabezado del menú desplegable */}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="locations-content"
                  id="locations-header"
                >
                  <Typography variant="body1">Ubicaciones</Typography>
                </AccordionSummary>

                {/* Contenido del menú desplegable */}
                <AccordionDetails>
                  <ul>
                    {location.length > 0 ? (
                      location.map((loc, index) => (
                        <li key={index}>{loc.location_area.name}</li>
                      ))
                    ) : (
                      <li>No hay ubicaciones disponibles</li>
                    )}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  );
}
export default PokemonDetails;
