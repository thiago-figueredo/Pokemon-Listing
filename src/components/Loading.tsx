import { useContext } from "react"
import { Fragment } from "react"
import PokemonContext from "../context/PokemonContext"
import Pokemon from "./Pokemon"

export default function Loading() {
  const { state, openPokemonModal, pokemonSectionRefs } = useContext(PokemonContext)
  const { pokemons, loadingPokemons } = state

  return <>
    {
      loadingPokemons ? 
        <section className="loading">
          <h3>Loading</h3>

          <div className="loading-dots">
            <h1 className="loading-effect">.</h1>
            <h1 className="loading-effect">.</h1>
            <h1 className="loading-effect">.</h1>
          </div>
        </section> : pokemons?.map((pokemon, index) => 
          <Fragment key={ pokemon.id }>
            <Pokemon 
              name={ pokemon.name } 
              src={ pokemon.src } 
              ref={ self => pokemonSectionRefs!.current[index] = self as HTMLElement }
              openPokemonModal={ openPokemonModal }
            />
          </Fragment>
        )
    }
  </>
}