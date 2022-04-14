import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { FaBars } from "react-icons/fa"
import PokemonContext from "../context/pokemon"

export default function GoToHome() {
  const navigate = useNavigate()
  const { setState } = useContext(PokemonContext)

  return <FaBars className="home" onClick={ 
    () => {
      setState(oldState => ({ 
        ...oldState, 
        loading: true,
        profileImage: ""
      }))

      navigate("/") 
    }
  } />
}
