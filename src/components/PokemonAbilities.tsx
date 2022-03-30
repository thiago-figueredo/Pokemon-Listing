import { CSSProperties, FC } from "react"

export interface IPokemonAbilitiesProps {
  readonly abilities?: string[]
  readonly style?: CSSProperties
}

const PokemonAbilities: FC<IPokemonAbilitiesProps> = (
  { abilities, style }: IPokemonAbilitiesProps
) => {
  return <div>
    <ul style={ style }>
      {
        abilities?.map((ability, index) => <li key={ index }>
          { ability }
        </li>)
      }
    </ul>
  </div>
}

export default PokemonAbilities