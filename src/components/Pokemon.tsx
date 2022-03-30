import { forwardRef, MouseEventHandler, Ref } from "react"
import "../styles/pokemon.scss"

interface IPokemonProps {
  readonly name: string
  readonly src: string
  readonly openPokemonModal: MouseEventHandler<HTMLElement>
}

const Pokemon = forwardRef<HTMLElement, IPokemonProps>((
  { name, src, openPokemonModal },
  ref
) => {
  return <>
    <section 
      id={ name } 
      ref={ ref }
      className="pokemon-section" 
      onClick={ openPokemonModal }
    >
      <div>
        <h3>{ name }</h3>
        <img src={ src } alt="" />
      </div>
    </section>
  </>
})

export default Pokemon