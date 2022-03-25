interface IPokemonTypeProps {
  readonly types: string[]
}

const PokemonType = ({ types }: IPokemonTypeProps) => {
  return <ul>
    {
      types.map((type, index) => <li key={ index }>
        { type }
      </li>)
    }
  </ul>
}

export default PokemonType