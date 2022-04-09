import { useEffect, useContext, Fragment } from "react"
import { IPokemonState } from "../interfaces/pokemon"
import PokemonContext, { initialPokemonState } from "../context/PokemonContext"
import Pokemon from "./pokemon/Pokemon"
import Loading from "./Loading"

export default function Main() {
  const { 
    state, 
    loading,
    setState, 
    setLoading,
    getNextPokemons, 
    loadPokemonsData, 
    getPreviousPokemons, 
    localStorage, 
    setLocalStorage
  } = useContext(PokemonContext)
  const { previousPokemonsUrl, nextPokemonsUrl } = state

  useEffect(() => { 
    const isFirstRender = () => 
      JSON.stringify(state) === JSON.stringify(initialPokemonState)

    if (isFirstRender()) {
      loadPokemonsData()
        .then(((pokemonData: IPokemonState) => {
          setState({ ...state, ...pokemonData })
          setLocalStorage(pokemonData)
          setLoading(false)
        }))
    } 
  })

  return (
    <main id="pokemon" style={ loading ? { cursor: "wait" } : {}} >
      {
        loading ? 
          <Loading /> : <>
             {
                localStorage.pokemons?.map(({ name, id, image }) => 
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