const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

export const fetchPokemon = async (limit = 1500, offset = 0) => {
  try {
    const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error("No se pudieron obtener Pokemones");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log("Error al obtener Pokemon", error);
    throw error;
  }
};

export const fetchPokemonDetails = async (pokemonUrl) => {
  try {
    const response = await fetch(pokemonUrl);
    if (!response.ok) {
      throw new Error("No se pudieron obtener los detalles del pokemon");
    }
    const data = await response.json();
    return {
      name: data.name,
      img: data.sprites.front_default,
    };
  } catch (error) {
    console.error("Error al obtener los detalles del Pokémon:", error);
    throw error;
  }
};

export const fetchPokemonInBatches = async (pokemonsList, batchSize = 50) => {
  const results = [];

  for (let i = 0; i < pokemonsList.length; i += batchSize) {
    // Obtener un lote de Pokémon
    const batch = pokemonsList.slice(i, i + batchSize);

    // Procesar las solicitudes del lote
    const batchDetails = await Promise.all(
      batch.map(async (pokemon) => {
        try {
          const details = await fetchPokemonDetails(pokemon.url); // Llamada para obtener detalles
          return details;
        } catch (error) {
          console.error(`Error al obtener detalles de ${pokemon.name}:`, error);
          return null; // Manejo de errores en cada solicitud
        }
      })
    );

    results.push(...batchDetails.filter(Boolean)); // Ignorar errores (null) y agregar los datos válidos
  }

  return results;
};
