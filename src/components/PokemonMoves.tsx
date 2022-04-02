import { CSSProperties, FC } from "react"

export interface IPokemonMoveProps {
  readonly moves?: string[]
  readonly style: CSSProperties
}

const PokemonMoves: FC<IPokemonMoveProps> = ({ moves, style }: IPokemonMoveProps) => {
  return <div>
    <ul style={ style }>
      {
        moves?.map((move, index) => <li key={ index }>
          { move }
        </li>)
      }
    </ul>
  </div>
}

export default PokemonMoves