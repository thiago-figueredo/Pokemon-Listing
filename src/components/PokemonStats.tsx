import { CSSProperties, FC, useState } from "react"
import { IPokemonStat } from "../interfaces/pokemon"
import { FaPlay } from "react-icons/fa"

export interface IPokemonStatsProps {
  readonly stats?: IPokemonStat[]
  readonly style?: CSSProperties
}

const PokemonStats: FC<IPokemonStatsProps> = (
  { stats, style }: IPokemonStatsProps
) => {
  const [openStatModal, setOpenStatModal] = useState(false)

  return <div>
    <ul style={ style }>
      {
        stats?.map(({ name, base_stat, effort }, index) => <li key={ index }>
          <strong>
            { name }
            <FaPlay onClick={ () => setOpenStatModal(!openStatModal) }/>
          </strong>

          {
            openStatModal && <ul>
              <li>base_stat: { base_stat }</li>
              <li>effort: { effort }</li>
            </ul>
          }
        </li>)
      }
    </ul>
  </div>
}

export default PokemonStats