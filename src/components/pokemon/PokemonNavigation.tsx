import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { useContext } from "react"
import PokemonContext from "../../context/PokemonContext"

export default function PokemoNavigation() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { 
    localStorage, 
    getNextPokemons, 
    getPreviousPokemons
  } = useContext(PokemonContext)

  return <>
    <FaArrowLeft 
      className={ "go-back" } 
      onClick={ 
        () => {
          const pokemonId = Number(id) - 1
          navigate(`/pokemon/${pokemonId}`) 
        }
      }
    />

    <FaArrowRight 
      className={ "go-next" } 
      onClick={ 
        async () => {
          const pokemonId = Number(id) + 1
          navigate(`/pokemon/${pokemonId}`) 
        }
      }
    />
  </>
}