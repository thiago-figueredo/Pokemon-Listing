import { IPokemonStat } from "../../interfaces/pokemon"
import { FC } from "react"
import PokemonBar from "./Bar"

export interface IPokemonStatsProps {
  readonly stats: IPokemonStat[]
}

enum PokemonStat {
  hp = "hp",
  attack = "attack",
  defense = "defense",
  specialAttack = "special-attack",
  specialDefense = "special-defense",
  speed = "speed"
}

const PokemonStats: FC<IPokemonStatsProps> = ({ stats }) => {
  if (!stats) return null

  const hp = stats.find(({ name }) => name === PokemonStat.hp) 
  const attack = stats.find(({ name }) => name === PokemonStat.attack)
  const defense = stats.find(({ name }) => name === PokemonStat.defense)
  const specialAttack = stats.find(({ name }) => name === PokemonStat.specialAttack)
  const specialDefense = stats.find(({ name }) => name === PokemonStat.specialDefense)
  const speed = stats.find(({ name }) => name === PokemonStat.speed)

  return stats.length ? (
    <section className="pokemon-stats">
      <span id="stat">Stats</span>

      <div className="hp">
        <PokemonBar 
          numberOfBarsForColumn={ 15 }
          base_stat={ hp?.base_stat as number }
        />
        <p>HP</p>
      </div>

      <div className="attack">
        <PokemonBar 
          numberOfBarsForColumn={ 15 }
          base_stat={ attack?.base_stat as number }
        />
        <p>Attack</p>
      </div>
      
      <div className="defense">
        <PokemonBar 
          numberOfBarsForColumn={ 15 }
          base_stat={ defense?.base_stat as number }
        />
        <p>Defense</p>
      </div>

      <div className="special-attack">
        <PokemonBar 
          numberOfBarsForColumn={ 15 }
          base_stat={ specialAttack?.base_stat as number }
        />
        <p>Special Attack</p>
      </div>

      <div className="special-defense">
        <PokemonBar 
          numberOfBarsForColumn={ 15 }
          base_stat={ specialDefense?.base_stat as number }
        />
        <p>Special Defense</p>
      </div>

      <div className="speed">
        <PokemonBar 
          numberOfBarsForColumn={ 15 }
          base_stat={ speed?.base_stat as number }
        />
        <p>Speed</p>
      </div>
    </section>
  ) : null
}

export default PokemonStats