import { 
  IPokemonAbilities, 
  IPokemonMoves, 
  IPokemonStats, 
  IPokemonTypes 
} from "../interfaces/pokemon"
import { CSSProperties, forwardRef, MouseEventHandler } from "react"
import PokemonInfoCard from "./PokemonInfoCard"
import "../styles/pokemonModal.scss"

export interface IPokemonModalProps {
  readonly name: string
  readonly src: string
  readonly height: number
  readonly weight: number
  readonly style: CSSProperties
  readonly types: IPokemonTypes
  readonly moves: IPokemonMoves
  readonly abilities: IPokemonAbilities
  readonly stats: IPokemonStats
  readonly closePokemonModal: MouseEventHandler<HTMLOrSVGElement>
}

const PokemonModal = forwardRef<HTMLElement, IPokemonModalProps>((
  { 
    name, src, height, weight, types, moves, 
    abilities, stats, style, closePokemonModal 
  },
  ref
) => {
  const pokemonInfoCardProps = { types, moves, abilities, stats }

  return <article id="pokemon-modal" ref={ ref } style={ style }>
    <section className="image">
      <img id="pokemon" src={ src } alt="" />
      <img 
        className={ `close-modal ${name}`} 
        alt=""
        src="https://cdn-icons-png.flaticon.com/512/753/753345.png" 
        onClick={ closePokemonModal } 
      />
    </section>

    <section id="pokemon-info">
      <div>
        <strong>name: </strong>
        <span>{ name }</span>
      </div>

      <div>
        <strong>height: </strong>
        <span>{ height }</span>
      </div>

      <div>
        <strong>weight: </strong>
        <span>{ weight }</span>
      </div>

      <PokemonInfoCard { ...pokemonInfoCardProps } />
    </section>
  </article> 
})

export default PokemonModal