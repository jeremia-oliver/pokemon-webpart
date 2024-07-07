import { makeAutoObservable, runInAction } from "mobx";
import { PokemonResultType } from "../models/Pokemon";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse  } from  "@microsoft/sp-http"
import { SPFI } from "@pnp/sp";
import { IDropdownOption } from '@fluentui/react';
import { getSP } from "../pnpjsConfig";

class PokemonStore{
    Url:string = '';
    isLoading: boolean = false;
    ListPokemon:PokemonResultType[] = [];
    ListTypes:IDropdownOption[] = [];
    ListCategories:IDropdownOption[] = [];
    SearchValue: string = '';
    TypeValue:string = '';
    CategoryValue:string = '';
    TotalData:number = 0;
    CurrentPage:number = 1;
    TotalPages:number = 0;
    PageSize:number = 20;
    SP:SPFI 

    constructor() {
        makeAutoObservable(this);
    }

    fetchPokemonbyPage = async(search:string, type:string ,category:string, page:number) => {
        runInAction(() => {
            this.ListPokemon = [];
            this.isLoading = true; 
        })
        const skipItems:number = this.PageSize * (page - 1);
        const takeItems:number = this.PageSize
        const LIST_NAME = "Pokemon";
        const SearchQuery = search != '' ? `<Contains><FieldRef Name="PokemonName"/><Value Type='Text'>${search}</Value></Contains>` : `<Gt><FieldRef Name="PokedexNumber"/><Value Type='Number'>0</Value></Gt>`;
        const TypeQuery = type != '' ? `<Eq><FieldRef Name="PokemonType"/><Value Type="Text">${type}</Value></Eq>` : `<IsNotNull><FieldRef Name="PokemonType"/></IsNotNull>`;
        const CategoryQuery = category != '' ? `<Eq><FieldRef Name="Category"/><Value Type="Text">${category}</Value></Eq>` : `<IsNotNull><FieldRef Name="Category"/></IsNotNull>`;
        let CAMLQuery = `<View><Query><Where><And><And>${SearchQuery}${TypeQuery}</And>${CategoryQuery}</And></Where></Query><OrderBy><FieldRef Name='PokedexNumber' /></OrderBy></View>`
        const items:any[] = await this.SP.web.lists.getByTitle(LIST_NAME).getItemsByCAMLQuery({
            ViewXml: CAMLQuery,
        });
        const TotalData = items.length;
        items?.slice(skipItems, skipItems+takeItems).forEach((e) => {
            runInAction(() => {
                this.ListPokemon.push({
                    PokemonName:e.PokemonName,
                    PokemonType:e.PokemonType,
                    Category:e.Category,
                    PokedexNumber:e.PokedexNumber,
                    Image:{
                        Description: e.PokemonName,
                        Url:`${this.Url}/Pokemon%20Lib/${e.PokemonName}.png`
                    },
                    Display:true
                });
            })
        })
        runInAction(() => {
            this.TotalPages = Math.ceil(TotalData / this.PageSize);
            this.TotalData = TotalData;
            this.CurrentPage = page;
            this.isLoading = false; 
        })
    }

    initPokemon = async (context:WebPartContext) => {
        runInAction(() => {
            this.Url = context.pageContext.web.absoluteUrl
            this.isLoading = true; 
        })
        const LIST_NAME = "Pokemon";
        this.SP = getSP(context);
        const ListTypesResponse:SPHttpClientResponse = await context.spHttpClient.get(`${context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${LIST_NAME}')/fields?$filter=EntityPropertyName eq 'PokemonType'`, SPHttpClient.configurations.v1);
        const ListTypesJson = (await ListTypesResponse.json()).value
        ListTypesJson[0].Choices.forEach((e:string) => {
            this.ListTypes.push({
                key:e,
                text:e,
            });
        })
        const ListCategoriesResponse:SPHttpClientResponse = await context.spHttpClient.get(`${context.pageContext.web.absoluteUrl}/_api/web/Lists/GetByTitle('${LIST_NAME}')/fields?$filter=EntityPropertyName eq 'Category'`, SPHttpClient.configurations.v1);
        const ListCategoriesJson = (await ListCategoriesResponse.json()).value
        ListCategoriesJson[0].Choices.forEach((e:string) => {
            this.ListCategories.push({
                key:e,
                text:e,
            })
        })
        runInAction(() => { 
            this.fetchPokemonbyPage('','','', 1)
        })
    }

    searchPokemon = (search:string, type:string, category:string):void => {
        this.fetchPokemonbyPage(search,type,category, 1)
        runInAction(() => { 
            this.SearchValue = search; 
            this.TypeValue = type; 
            this.CategoryValue = category; 
        })
    }

    filterPokemon = (type:string, category:string):void => {
        this.fetchPokemonbyPage(this.SearchValue,type,category, 1)
        runInAction(() => { 
            this.TypeValue = type; 
            this.CategoryValue = category; 
        })
    }
}
export const pokemonStore = new PokemonStore();