import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { IPokemon } from "../../interfaces/pokemon"
import PokemonContext, { getPokemonProfileImage } from "../../context/PokemonContext"
import PokemonStats, { IPokemonStatsProps } from "./PokemonStats"
import PokemonInvalid from "../../pages/pokemon/PokemonInvalid"
import GoToHome from "../GoToHome"
import Loading from "../Loading"
import PokemoNavigationButtons from "./PokemonNavigation"
import "../../styles/pokemonProfile.scss"

export default function PokemonProfile() {
  const { id } = useParams()
  const { 
    loading, 
    pokeApiURL,
    setLoading, 
    loadPokemonsData,
    localStorage,
    setLocalStorage
  } = useContext(PokemonContext)
  const byId = (pokemon: IPokemon) => pokemon.id === Number(id)
  const pokemonLocalStorage = localStorage.pokemons.find(byId) as IPokemon
  const [profileImage, setProfileImage] = useState(pokemonLocalStorage?.image.large)
  const pokemonStatsProps: IPokemonStatsProps = { stats: pokemonLocalStorage?.stats }

  useEffect(() => {
    if (pokemonLocalStorage?.id !== Number(id)) {
      const pokemonId = Number(id)
      
      setLoading(true)

      Promise.all([
        loadPokemonsData(`${pokeApiURL}/?offset=${pokemonId - 1}&limit=${1}`)
          .then(pokemonData => setLocalStorage(pokemonData)),
        getPokemonProfileImage(pokemonLocalStorage?.url)
          .then(profileImage => setProfileImage(profileImage))
      ])
      
      setLoading(false)
    }
  })

  return <>
    <GoToHome />

    {
      loading ? 
        <Loading /> : 
        <section className="pokemon-profile">
          <h2>{ pokemonLocalStorage?.name } #{ id }</h2>

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
                <span>{ pokemonLocalStorage?.height / 10 }&nbsp;m</span>
              </div>

              <div>
                <strong>Weight</strong>
                <span>{ pokemonLocalStorage?.weight / 10 }&nbsp;kg</span>
              </div>

              <div>
                <strong>Types</strong>
                <div>
                  { pokemonLocalStorage?.types.map(type => <p key={ id + type }>{ type }</p>) }
                </div>
              </div>

              <div>
                <strong>Abilities</strong>
                <div>
                  { 
                    pokemonLocalStorage?.abilities.map(ability => 
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
