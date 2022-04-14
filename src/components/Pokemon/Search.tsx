import { 
  Ref, 
  useContext, 
  forwardRef, 
  MutableRefObject,
  ForwardRefRenderFunction
} from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import PokemonContext from "../../context/pokemon"
import "../../styles/pokemonSearch.scss"

const SearchPokemon = (
  _ = null, 
  pokemonSearchRef: MutableRefObject<HTMLInputElement>
) => {
  const navigate = useNavigate()
  const { 
    setState, 
    getPokemon,
    setLocalStorage
  } = useContext(PokemonContext)

  const searchPokemon = async () => {
    const pokemonName = pokemonSearchRef?.current.value
    const pokemon = await getPokemon({ name: pokemonName?.toLowerCase() }) 

    setLocalStorage(oldLocalStorage => ({ ...oldLocalStorage, pokemon }))
    setState(oldState => ({ ...oldState, loading: false, profileImage: "" }))
    navigate(`/pokemon/${pokemon?.id}`)
  }

  return (
    <div 
      className="search" 
      onKeyDown={ ({ key }) => { 
        if (key === "Enter") {
          setState(oldState => ({ ...oldState, loading: true }))
          searchPokemon() 
        } 
      }
    }>
      <input 
        ref={ pokemonSearchRef as Ref<HTMLInputElement> } 
        placeholder="Enter a pokemon name..."
      />

      <button onClick={ () => {
          setState(oldState => ({ ...oldState, loading: true}))
          searchPokemon()
        }
      }>
        <FaSearch />
      </button>
    </div>
  )
}

export default forwardRef<HTMLInputElement>(
  SearchPokemon as ForwardRefRenderFunction<HTMLInputElement, any>
)