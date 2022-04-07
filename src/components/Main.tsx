import { useEffect, useContext, Fragment } from "react"
import { IPokemon, IPokemonState } from "../interfaces/pokemon"
import PokemonContext, { initialState } from "../context/PokemonContext"
import Pokemon from "./pokemon/Pokemon"

export default function Main() {
  const { 
    state, 
    setState, 
    getNextPokemons, 
    loadPokemonsData, 
    getPreviousPokemons, 
    pokemonsLocalStorage, 
    setPokemonsToLocalStorage
  } = useContext(PokemonContext)
  const { previousPokemonsUrl, nextPokemonsUrl } = state

  useEffect(() => { 
    const isFirstRender = () => JSON.stringify(state) === JSON.stringify(initialState)

    if (isFirstRender() && !pokemonsLocalStorage.length) {
      loadPokemonsData()
        .then(((pokemonData: Partial<IPokemonState>) => {
          setState({ ...state, ...pokemonData })
          setPokemonsToLocalStorage(pokemonData.pokemons as IPokemon[])
        }))
    } 
  })

  return (
    <main id="pokemon">
      {
        !pokemonsLocalStorage.length ? 
          <section className="loading">
            <h3>Loading</h3>

            <div className="loading-dots">
              <h1 className="loading-effect">.</h1>
              <h1 className="loading-effect">.</h1>
              <h1 className="loading-effect">.</h1>
            </div>
          </section> : pokemonsLocalStorage?.map(({ name, id, image }) => 
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
          style={ previousPokemonsUrl ? {} : { cursor: "no-drop" }}
        >
          Previous
        </button>

        <button 
          onClick={ getNextPokemons }
          style={ nextPokemonsUrl ? {} : { cursor: "no-drop" }}
        >
          Next
        </button>
      </div>
    </main>
  )
}