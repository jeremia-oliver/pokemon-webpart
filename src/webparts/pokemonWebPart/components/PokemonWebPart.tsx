import * as React from 'react';
import { useEffect } from 'react';
import type { IPokemonWebPartProps } from './IPokemonWebPartProps';
import ListPokemonComponent from './ListPokemonComponent';
import SearchPokemonComponent from './SearchPokemonComponent';
import FilterPokemonComponent from './FilterPokemonComponent';
import { pokemonStore } from '../stores/PokemonStore';

const PokemonWebPart : React.FC<IPokemonWebPartProps> = (props) => {

  useEffect(() => { pokemonStore.initPokemon(props.context) },[])

  return (
    <>
    <SearchPokemonComponent />
    <FilterPokemonComponent />
    <ListPokemonComponent />
    </>
  );
  
}

export default PokemonWebPart
