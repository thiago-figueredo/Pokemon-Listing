import { useEffect, useContext, Fragment, forwardRef, MutableRefObject } from "react"
import { IPokemonState } from "../interfaces/pokemon"
import PokemonContext, { pokeApiURL } from "../context/pokemon"
import Pokemon from "./Pokemon/Index"
import Loading from "./Loading"
import { ForwardRefRenderFunction } from "react"

const Main = (
  _ = null, 
  pokemonSearchRef: MutableRefObject<HTMLInputElement>
) => {
  const { 
    pokemons,
    loading,
    setState, 
    getNextPokemons, 
    nextPokemonsUrl,
    loadPokemonsData, 
    getPreviousPokemons,
    previousPokemonsUrl
  } = useContext(PokemonContext)

  useEffect(() => { 
    const randomInteger = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min

    if (!pokemons.length) {
      loadPokemonsData(`${pokeApiURL}/?limit=10&offset=${randomInteger(1, 1000)}`)
        .then(((pokemonData: IPokemonState) => 
          setState(oldState => ({ ...oldState, ...pokemonData, loading: false }))
        ))

      return
    }

    pokemonSearchRef.current.focus()
    pokemonSearchRef.current.value = ""
    setState(oldState => ({ ...oldState, loading: false }))
  }, [loadPokemonsData, setState, pokemons, pokemonSearchRef])

  return (
    <main id="pokemon" style={ loading ? { cursor: "wait" } : {} }>
      {
        loading ? 
          <Loading /> : <>
             {
                pokemons?.map(({ name, id, image }) => 
                  <Fragment key={ id }>
                    <Pokemon 
                      id={ id }
                      name={ name }
                      src={ image.small }
                    />
                  </Fragment>
                )
             }

             <div className="toggle-page">
                <button 
                  onClick={ getPreviousPokemons }
                  style={ previousPokemonsUrl ? 
                    {} : { cursor: "no-drop", opacity: "0.4" }
                  }
                >
                  Previous
                </button>

                <button 
                  onClick={ getNextPokemons }
                  style={ nextPokemonsUrl ? 
                    {} : { cursor: "no-drop", opacity: "0.6" }
                  }
                >
                  Next
                </button>
              </div>
          </>
      }
    </main>
  )
}

export default forwardRef<HTMLInputElement>(
  Main as ForwardRefRenderFunction<HTMLInputElement, any>
)