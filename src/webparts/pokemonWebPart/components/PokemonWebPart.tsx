import * as React from 'react';
import { useEffect } from 'react';
import type { IPokemonWebPartProps } from './IPokemonWebPartProps';
// import { SPFI } from '@pnp/sp';
// import { getSP } from '../pnpjsConfig';
import ListPokemonComponent from './ListPokemonComponent';
import SearchPokemonComponent from './SearchPokemonComponent';
import FilterPokemonComponent from './FilterPokemonComponent';
import { pokemonStore } from '../stores/PokemonStore';

const PokemonWebPart : React.FC<IPokemonWebPartProps> = (props) => {

  useEffect(() => { pokemonStore.fetchPokemon(props.context) },[])

  return (
    <>
    <SearchPokemonComponent />
    <FilterPokemonComponent />
    <ListPokemonComponent />
    </>
  );
  
}

export default PokemonWebPart
