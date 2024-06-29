import * as React from 'react';
import {useState} from 'react';
import { observer } from "mobx-react";
import { pokemonStore } from '../stores/PokemonStore';
import { makeStyles, getTheme, Modal  } from '@fluentui/react';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { NeutralColors } from '@fluentui/theme';


const theme = getTheme();
const LoadingStyles = {
    marginTop:"20px",
    marginBottom:"20px"
  };
const useClasses = makeStyles({
    FlexContainer:{
      display:"grid",
      paddingBottom: "100px",
      gridTemplateColumns: "50% 50%",
      width:"100%",
      maxWidth:"1000px",
      margin:"auto",
      alignItems:"end",
      '@media screen and (min-width:468px)':{
        gridTemplateColumns: "25% 25% 25% 25%",
      },
      '@media screen and (min-width:768px)':{
        gridTemplateColumns: "20% 20% 20% 20% 20%",
      }
    },
    ColContainer:{
      cursor:"pointer",
      textAlign:"center",
      width:"90%",
      margin:"auto",
      backgroundColor:NeutralColors.white,
      marginTop:"20px",
      padding: "10px",
      boxShadow: theme.effects.elevation8,
      borderRadius: "6px",
      boxSizing:"border-box"
    },
    ColContainerImage:{
      width:"100%",
      height:"110px",
      backgroundColor:NeutralColors.gray30,
      marginBottom: "6px",
    },
    ColImage:{
      height:"100%",
    },
    ColHidden:{
      display:"none"
    },
    PokemonId:{
      display:"block",
    },
    PokemonName:{
      height:"39px",
      display:"block",
    },
    PokemonType:{
      display:"flex",
      flexDirection:"row",
      justifyContent: "center",
      alignItems:"center",
    },
    NotFound:{
      textAlign:"center",
      paddingTop:"100px",
      paddingBottom:"20vh"
    },
    callout:{
        padding:"10px"
    },
    headingMetadata:{
        marginTop:"0px",
    },
    tableMetadata:{
      fontSize:"12px",
      width:"80%",
      '& td':{
        verticalAlign:"top",
        padding:"2px"
      }
    },
    tableBreakWord:{
      wordBreak:"break-word",
      '@media screen and (min-width:768px)':{
        wordBreak:"unset"
      }
    }
    
  })


  function ListPokemonComponent() {
    const [calloutId, setCalloutId] = useState(0);
    const classes = useClasses();
    const {isLoading, ListPokemon} = pokemonStore
    if(isLoading) return (
        <div style={LoadingStyles}>
            <Spinner label="Loading Pokemon..." />
        </div>
    )
    return (
        <>
        <div className={classes.FlexContainer}>
        {
            ListPokemon?.map((e) => {
                if(e.Display) return (
                    <>
                    <div 
                    id={e.PokemonName}
                    onClick={() => setCalloutId(e.PokedexNumber)}
                    className={classes.ColContainer}>
                        <div className={classes.ColContainerImage}>
                        <img
                            className={classes.ColImage}
                            src={ e.Image.Url }
                            alt={ e.PokemonName }
                        />
                        </div>
                        <span className={classes.PokemonId}>#{ e.PokedexNumber }</span>
                        <span>{ e.PokemonName }</span>
                    </div>
                    
                    </>
                )
            })
        }
        </div>
        {calloutId !== 0 && (
            <Modal
                isOpen={calloutId !== 0}
                onDismiss={() => setCalloutId(0)}
            >
            <div className={classes.callout}>
                <h3 className={classes.headingMetadata}>Metadata</h3>
                {
                ListPokemon?.filter((el) => { return el.PokedexNumber === calloutId }).map((e) => {
                return (<table className={classes.tableMetadata}>
                <tbody>
                <tr>
                    <td>No</td>
                    <td>:</td>
                    <td>{ e.PokedexNumber }</td>
                </tr>
                <tr>
                    <td>Name</td>
                    <td>:</td>
                    <td>{ e.PokemonName }</td>
                </tr>
                <tr>
                    <td>Type</td>
                    <td>:</td>
                    <td>{ e.PokemonType }</td>
                </tr>
                <tr>
                    <td>Category</td>
                    <td>:</td>
                    <td>{ e.Category }</td>
                </tr>
                <tr>
                    <td>Image</td>
                    <td>:</td>
                    <td className={classes.tableBreakWord}>{ e.Image.Url }</td>
                </tr>
                </tbody>
                </table>)
                })
                }
            </div>
            </Modal>
            )
        }       
        </>
    )
}
export default observer(ListPokemonComponent)