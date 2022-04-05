import { useEffect, useContext } from "react"
import { initialState } from "../context/PokemonContext"
import PokemonContext from "../context/PokemonContext"
import PokemonModal from "../components/PokemonModal"
import Loading from "./Loading"

export default function Main() {
  const { 
    state, setState, loadPokemonsData, getPreviousPokemons, getNextPokemons 
  } = useContext(PokemonContext)
  const { pokemons, pokemonModals, previousPokemonsUrl, nextPokemonsUrl } = state

  useEffect(() => { 
    if (JSON.stringify(state) === JSON.stringify(initialState)) {
      loadPokemonsData()
        .then(pokemonData => setState({ 
          ...state, 
          ...pokemonData, 
          loadingPokemons: false 
        }))
    }
  }, [state, setState, loadPokemonsData])

  return <main id="pokemon">
    <Loading />

    {
      pokemonModals?.map(({ display, style }, index) => {
        const pokemonModalProps = { ...pokemons![index], style }
        return display && <PokemonModal key={ index } { ...pokemonModalProps } />
      })
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
}