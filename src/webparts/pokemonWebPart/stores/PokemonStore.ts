import { makeAutoObservable, runInAction } from "mobx";
import { PokemonResultType } from "../models/Pokemon";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { getSP } from "../pnpjsConfig";

class PokemonStore{
    isLoading: boolean = false;
    PokemonResults:any[];
    ListPokemon:PokemonResultType[] = [];
    SearchValue: string = '';

    constructor() {
        makeAutoObservable(this);
    }

    fetchPokemon = async (context:WebPartContext) => {
        runInAction(() => { this.isLoading = true; })
        const LIST_NAME = "Pokemon";
        const _sp:SPFI = getSP(context);
        const items:any[] = await _sp.web.lists.getByTitle(LIST_NAME).items.top(10)();
        items?.forEach((e) => {
            runInAction(() => {
                this.ListPokemon.push({
                    PokemonName:e.PokemonName,
                    PokemonType:e.PokemonType,
                    Category:e.Category,
                    PokedexNumber:e.PokedexNumber,
                    Image:{
                        Description:e.PokemonName,
                        Url:e.Url,
                    },
                    Display:true
                })
            })
        })
        runInAction(() => { 
            this.isLoading = false; 
        })
    }

    filterPokemon = async (search:string) => {
        runInAction(() => { 
            this.ListPokemon = this.ListPokemon.map(obj => {
                const newObj = Object.assign({}, obj);
                newObj.Display = (obj.PokemonName).toLowerCase().includes(search.toLowerCase(), 0);
                return newObj;
            });
            this.SearchValue = search; 
        })
    }
}
export const pokemonStore = new PokemonStore();