import { MouseEventHandler } from "react"
import "../styles/pokemon.scss"

interface IPokemonProps {
  readonly name: string
  readonly src: string
  readonly openPokemonModal: MouseEventHandler<HTMLElement>
}

export default function Pokemon(
  { name, src, openPokemonModal }: IPokemonProps,
) {
  return <>
    <section 
      onClick={ openPokemonModal } 
    >
      <div>
        <h3>{ name }</h3>
        <img src={ src } alt={ name } />
      </div>
    </section>
  </> 
}