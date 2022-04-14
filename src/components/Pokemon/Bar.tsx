export interface IPokemonBarProps {
  readonly numberOfBarsForColumn: number
  readonly base_stat: number
}

const defaultPokemonBarProps = { numberOfBarsForColumn: 15 } as IPokemonBarProps

export default function PokemonBar(
  { numberOfBarsForColumn, base_stat }: IPokemonBarProps = defaultPokemonBarProps
) {
  return <>
    { 
      base_stat && 
        Array(numberOfBarsForColumn)
          .fill(0)
          .map((_, index) => {
            const bars = Math.floor(base_stat / numberOfBarsForColumn) 
            return index < numberOfBarsForColumn - bars ? 
              <div 
                key={ `${base_stat}-${index}` } 
                style={{ background: "#202020" }}
              ></div> :
              <div key={ `${base_stat}-${index}` }></div> 
          })
    }
  </>
}