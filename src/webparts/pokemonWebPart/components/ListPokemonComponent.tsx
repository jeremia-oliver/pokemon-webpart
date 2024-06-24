import * as React from 'react';
import { observer } from "mobx-react";
import { pokemonStore } from '../stores/PokemonStore';

function ListPokemonComponent(){
    const {isLoading, ListPokemon} = pokemonStore
    if(isLoading) return (
        <div>
          Loading...
        </div>
    )
    
    return (
        <>
        <h3>List Pokemon Component</h3>
        {
            ListPokemon?.map((e) => {
                if(e.Display) return (
                    <div>{ e.PokemonName }</div>
                )
            })
        }
        </>
    )
}
export default observer(ListPokemonComponent)