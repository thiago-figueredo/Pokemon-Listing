interface IPokemonMoveProps {
  readonly moves: string[]
}

const PokemonMove = ({ moves }: IPokemonMoveProps) => {
  return <ul>
    {
      moves.map((move, index) => <li key={ index }>
        { move }
      </li>)
    }
  </ul>
}

export default PokemonMove