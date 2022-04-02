import { FC } from "react"

export interface IPokemonTypeProps {
  readonly types?: string[]
}

const PokemonTypes: FC<IPokemonTypeProps> = ({ types }: IPokemonTypeProps) => {
  return <div>
    <ul>
      {
        types?.map((type, index) => <li key={ index }>
          { type }
        </li>)
      }
    </ul>
  </div>
}

export default PokemonTypes