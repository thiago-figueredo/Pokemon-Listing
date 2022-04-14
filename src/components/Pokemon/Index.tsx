import { useCallback, useContext } from "react"
import { useNavigate } from "react-router-dom"
import PokemonContext from "../../context/pokemon"
import "../../styles/pokemon.scss"

interface IPokemonProps {
  readonly id?: number
  readonly name?: string
  readonly src?: string
}

export default function Pokemon({ name, src, id }: IPokemonProps) {
  const pokemonId = Number(id)
  const navigate = useNavigate()
  const { setState, setPokemonToLocalStorage } = useContext(PokemonContext)

  const showPokemon = useCallback(() => {
    setState(oldState => ({ ...oldState, loading: true }))
    navigate(`/pokemon/${pokemonId}`)
    setPokemonToLocalStorage(pokemonId)
    setState(oldState => ({ ...oldState, pokemons: [] }))
  }, [navigate, pokemonId, setPokemonToLocalStorage, setState])

  return (
    <section 
      id={ name } 
      className="pokemon-section" 
      onClick={ showPokemon }
    >
      <div>
        <h3>{ name }</h3>
        <img src={ src } alt="" />
      </div>
    </section>
  )
}
