import { MouseEventHandler } from "react"
import { FaPlay } from "react-icons/fa"

interface IPokemonInfoCardHelper {
  readonly label: string
  readonly openInfo: boolean
  readonly openPokemonInfoCard: MouseEventHandler<SVGElement>
}

export default function PokemonInfoCardHelper({ 
  label, openInfo, openPokemonInfoCard 
}: IPokemonInfoCardHelper) {
  return <strong>
    { label }
    <FaPlay 
      onClick={ openPokemonInfoCard } 
      style={ openInfo ? {} : { opacity: "0.3" }}
    />
  </strong>
}