import { useNavigate } from "react-router-dom"
import "../../styles/pokemon.scss"

interface IPokemonProps {
  readonly id?: number
  readonly name?: string
  readonly src?: string
}

export default function Pokemon({ name, src, id }: IPokemonProps) {
  const navigate = useNavigate()

  return (
    <section 
      id={ name } 
      className="pokemon-section" 
      onClick={ () => navigate(`/pokemon/${id}`) }
    >
      <div>
        <h3>{ name }</h3>
        <img src={ src } alt="" />
      </div>
    </section>
  )
}
