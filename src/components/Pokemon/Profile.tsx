import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import PokemonStats, { IPokemonStatsProps } from "./Stats"
import PokemonInvalid from "../../pages/pokemon/PokemonInvalid"
import GoToHome from "../GoToHome"
import Loading from "../Loading"
import PokemoNavigationButtons from "./Navigation"
import PokemonContext, { 
  getPokemonProfileImage, 
  pokeApiURL 
} from "../../context/pokemon"
import "../../styles/pokemonProfile.scss"

export default function PokemonProfile() {
  const { id } = useParams()
  const { 
    loading, 
    setState,
    localStorage,
    profileImage,
    setPokemonToLocalStorage,
  } = useContext(PokemonContext)
  const { pokemon } = localStorage
  const pokemonStatsProps: IPokemonStatsProps = { 
    stats: pokemon?.stats 
  }

  useEffect(() => {
    const pokemonId = Number(id) 

    if (!profileImage ) {
      setPokemonToLocalStorage(pokemonId)
      getPokemonProfileImage(`${pokeApiURL}/${pokemonId}`)
        .then(profileImage => profileImage ? 
          setState(oldState => ({ ...oldState, profileImage, loading: false })) : 
          setState(oldState => ({ ...oldState, profileImage: " ", loading: false })))
    }
  }, [id, profileImage, setState, setPokemonToLocalStorage])

  if (!pokemon) {
    return <PokemonInvalid />
  }

  return <>
    <GoToHome />

    {
      loading ? 
        <Loading /> : 
        <section className="pokemon-profile">
          <h2>
            { `${pokemon.name?.at(0)?.toUpperCase()}${pokemon.name?.slice(1)}` }
          </h2>

          <article>
            <section className="image">
              <img 
                id="pokemon" 
                src={ profileImage } 
                alt="" 
              />
            </section>

            <section id="pokemon-info">
              <div>
                <strong>Height</strong>
                <span>{ pokemon?.height / 10 }&nbsp;m</span>
              </div>

              <div>
                <strong>Weight</strong>
                <span>{ pokemon?.weight / 10 }&nbsp;kg</span>
              </div>

              <div>
                <strong>Types</strong>
                <div>
                  { 
                    pokemon?.types.map(type => 
                      <p key={ id + type }>{ type }</p>) 
                  }
                </div>
              </div>

              <div>
                <strong>Abilities</strong>
                <div>
                  { 
                    pokemon?.abilities.map(ability => 
                      <p key={ id + ability }>{ ability }</p>) 
                  }
                </div>
              </div>
            </section>

            <PokemonStats { ...pokemonStatsProps } />
          </article> 
        </section> 
    }

    <PokemoNavigationButtons />
  </>
}
