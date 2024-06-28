import { makeAutoObservable, runInAction } from "mobx";
import { PokemonResultType } from "../models/Pokemon";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import { IDropdownOption } from '@fluentui/react';
import { getSP } from "../pnpjsConfig";

class PokemonStore{
    isLoading: boolean = false;
    PokemonResults:any[];
    ListPokemon:PokemonResultType[] = [];
    ListTypes:IDropdownOption[] = [];
    ListCategories:IDropdownOption[] = [];
    SearchValue: string = '';
    TypeValue:string = '';
    CategoryValue:string = '';

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
                });
                if(this.ListTypes.findIndex(i => i.key === e.PokemonType) === -1){
                    this.ListTypes.push({
                        key:e.PokemonType,
                        text:e.PokemonType,
                    });
                }

                if(this.ListCategories.findIndex(i => i.key === e.Category) === -1){
                this.ListCategories.push({
                    key:e.Category,
                    text:e.Category,
                })
                }
            })
        })
        const SortOption = (a:IDropdownOption, b:IDropdownOption) => { return (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0) };
        runInAction(() => { 
            this.ListTypes = this.ListTypes.sort(SortOption);
            this.ListCategories = this.ListCategories.sort(SortOption);
            this.isLoading = false; 
        })
    }

    searchPokemon = (search:string, type:string, category:string) => {
        runInAction(() => { 
            this.ListPokemon = this.ListPokemon.map(obj => {
                const newObj = Object.assign({}, obj);
                newObj.Display = (obj.PokemonName).toLowerCase().includes(search.toLowerCase(), 0);
                if(type !== '' && newObj.Display){
                    newObj.Display = (obj.PokemonType).toLowerCase().includes(type.toLowerCase(), 0);
                }
                if(category !== '' && newObj.Display){
                    newObj.Display = (obj.Category).toLowerCase().includes(category.toLowerCase(), 0);
                }
                return newObj;
            });
            console.log(search)
            this.SearchValue = search; 
            this.TypeValue = type; 
            this.CategoryValue = category; 
        })
    }

    filterPokemon = (type:string, category:string) => {
        runInAction(() => { 
            this.ListPokemon = this.ListPokemon.map(obj => {
                const newObj = Object.assign({}, obj);
                newObj.Display = (obj.PokemonName).toLowerCase().includes(this.SearchValue.toLowerCase(), 0);
                if(type !== '' && newObj.Display){
                    newObj.Display = (obj.PokemonType).toLowerCase().includes(type.toLowerCase(), 0);
                }
                if(category !== '' && newObj.Display){
                    newObj.Display = (obj.Category).toLowerCase().includes(category.toLowerCase(), 0);
                }
                return newObj;
            });
            this.TypeValue = type; 
            this.CategoryValue = category; 
        })
    }
}
export const pokemonStore = new PokemonStore();