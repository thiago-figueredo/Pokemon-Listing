import { CSSProperties, FC } from "react"

export interface IPokemonTypeProps {
  readonly types?: string[]
  readonly style?: CSSProperties
}

const PokemonTypes: FC<IPokemonTypeProps> = (
  { types, style }: IPokemonTypeProps
) => {
  return <div>
    <ul style={ style }>
      {
        types?.map((type, index) => <li key={ index }>
          { type }
        </li>)
      }
    </ul>
  </div>
}

export default PokemonTypes