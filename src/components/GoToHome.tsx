import { useNavigate } from "react-router-dom"
import { FaBars } from "react-icons/fa"
import { useContext } from "react"
import PokemonContext from "../context/PokemonContext"

export default function GoToHome() {
  const navigate = useNavigate()
  const { setLoading } = useContext(PokemonContext)

  return <FaBars 
    className="home" 
    onClick={ 
      () => {
        // setLoading(true)
        navigate("/") 
      }
    } />
}
