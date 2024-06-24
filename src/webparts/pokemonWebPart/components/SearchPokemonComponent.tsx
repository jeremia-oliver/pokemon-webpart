import * as React from 'react';
import { observer } from "mobx-react";
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { pokemonStore } from '../stores/PokemonStore';

function SearchPokemonComponent(){
    const {filterPokemon} = pokemonStore
    const SearchPokemon = (v:string | undefined) => {
        const search:string = typeof v === 'undefined' ? '' : v
        filterPokemon(search)
    } 
    return (
        <SearchBox placeholder="Search Pokemon Name"  onChange={e => SearchPokemon((e?.target)?.value)}/>
    )
}
export default observer(SearchPokemonComponent)