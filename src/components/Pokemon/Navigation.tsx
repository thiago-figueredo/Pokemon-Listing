import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { useContext, useRef, Ref } from "react"
import PokemonContext from "../../context/pokemon"

export default function PokemoNavigation() {
  const goBackRef =useRef<HTMLButtonElement>()
  const goNextRef =useRef<HTMLButtonElement>()
  const navigate = useNavigate()
  const { id } = useParams()
  const { setState } = useContext(PokemonContext)

  return <>
    <button 
      className="go-back" 
      ref={ goBackRef as Ref<HTMLButtonElement> }
      onClick={ 
        () => {
          const pokemonId = Number(id) - 1

          setState(oldState => ({ ...oldState, loading: true, profileImage: "" }))
          navigate(`/pokemon/${pokemonId}`) 
        }
      }
    >
      <FaArrowLeft />
    </button>

    <button 
      className="go-next" 
      ref={ goNextRef as Ref<HTMLButtonElement> }
      onClick={ 
        async () => {
          const pokemonId = Number(id) + 1

          setState(oldState => ({ ...oldState, loading: true, profileImage: "" }))
          navigate(`/pokemon/${pokemonId}`) 
        }
      }
    >
      <FaArrowRight />
    </button>
  </>
}