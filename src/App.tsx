import { 
  CSSProperties, 
  Fragment,
  MouseEvent, 
  useCallback, 
  useEffect, 
  useState, 
  useRef
} from "react"
import { IPokemon, IPokeApiPokemon, IPokeApiResponse } from "./interfaces/pokemon"
import PokemonModal from "./components/PokemonModal"
import Pokemon from './components/Pokemon'
import Header from "./components/Header"

export interface IPokemonModal {
  readonly display: boolean
  readonly style: CSSProperties
}

export interface IPokemonState {
  readonly pokemons: IPokemon[]
  readonly previousPokemonsUrl: string
  readonly nextPokemonsUrl: string
  readonly pokemonModals: IPokemonModal[]
  readonly loadingPokemon: boolean
}

export const initialState: IPokemonState = {
  pokemons: [],
  pokemonModals: Array(20),
  previousPokemonsUrl: "",
  nextPokemonsUrl: "",
  loadingPokemon: true
}

export default function App() {
  const pokemonUrl = "https://pokeapi.co/api/v2/pokemon"
  const pokemonSectionRefs = useRef<HTMLElement[]>([])
  const [state, setState] = useState<IPokemonState>(initialState)

  const pokemons = state.pokemons
  const pokemonModals = state.pokemonModals
  const previousPokemonsUrl = state.previousPokemonsUrl
  const nextPokemonsUrl = state.nextPokemonsUrl

  const isFirstRender = () => JSON.stringify(state) === JSON.stringify(initialState) 

  const getJSON = async (url: string) => {
    const response = await fetch(url)
    return response.json()
  }

  const getPokemonImage = useCallback(async (
    id: number,
    url: string = "https://pokeapi.co/api/v2/pokemon-form"
  ) => {
    try {
        const { sprites } = await getJSON(`${url}/${id}`)
        const imageSourceUrl = sprites["front_default"]
        const response = await fetch(imageSourceUrl)
        const blob = await response.blob()
        const src = URL.createObjectURL(blob as Blob)

        return src
    } catch {}
  }, [])

  const loadPokemons = useCallback(async (url: string = pokemonUrl) => {
    try {
      const { results, next, previous }: IPokeApiResponse = await getJSON(url)
      const pokemons: IPokemon[] = await Promise.all(
        results.map(async ({ name, url }) => {
          const {
            id, moves, types, abilities, height, weight, stats
          }: IPokeApiPokemon = await getJSON(url)
          const src = await getPokemonImage(id) as string

          return {
            name, height, weight, id, src,
            isDisplayed: false,
            types: types.map(({ type }) => type.name),
            moves: moves.map(({ move }) => move.name),
            abilities: abilities.map(({ ability }) => ability.name),
            stats: stats.map(({ base_stat, effort, stat }) => 
              ({ base_stat, effort, name: stat.name }))
          } 
        })
      )

      setState(oldState => ({ 
        ...oldState, 
        pokemons, 
        nextPokemonsUrl: next, 
        previousPokemonsUrl: previous,
        loadingPokemon: false 
      })) 
    } catch {}
  }, [setState, getPokemonImage])

  const getPreviousPokemons = useCallback(async () => {
    if (previousPokemonsUrl) {
      setState(oldState => ({ ...oldState, loadingPokemon: true }))
      loadPokemons(previousPokemonsUrl) 
    }
  }, [nextPokemonsUrl, loadPokemons])

  const getNextPokemons = useCallback(async () => {
    if (nextPokemonsUrl) {
      setState(oldState => ({ ...oldState, loadingPokemon: true }))
      loadPokemons(nextPokemonsUrl) 
    }
  }, [nextPokemonsUrl, loadPokemons])

  const openPokemonModal = useCallback(({ currentTarget }: MouseEvent<HTMLElement>) => {
    const pokemonName = currentTarget.id
    const pokemonIndex = pokemons.findIndex(({ name }) => name === pokemonName)
    const gridRow = `${pokemonIndex + 1} / ${pokemonIndex + 2}`

    pokemonSectionRefs.current[pokemonIndex]!.style.display = "none"

    setState(oldState => { 
      const pokemonModals = oldState.pokemonModals

      pokemonModals[pokemonIndex] = {
        display: true,
        style: { gridRow }
      }

      return { ...oldState, pokemonModals }
    })
  }, [pokemons])

  const closePokemonModal = useCallback(({ currentTarget }: MouseEvent<HTMLElement>) => {
    const arrayWithPokemonName = currentTarget.className.match(/close-modal (.*)/)

    if (arrayWithPokemonName) {
      const pokemonIndex = pokemons.findIndex(({ name }) => 
        name === arrayWithPokemonName[1])

      pokemonSectionRefs.current[pokemonIndex]!.style.display = ""

      setState(oldState => { 
        let pokemonModals = oldState.pokemonModals
        pokemonModals[pokemonIndex] = { display: false, style: {} }

        return { 
          ...oldState, 
          pokemonModals 
        }
      })
    }
  }, [pokemons])

  useEffect(() => {
    isFirstRender() && loadPokemons(pokemonUrl)
  }, [pokemons])


  return <>
    <Header />

    <main id="pokemon">
      {
        state.loadingPokemon ? 
          <section className="loading">
            <h3>Loading</h3>

            <div className="loading-dots">
              <h1 className="loading-effect">.</h1>
              <h1 className="loading-effect">.</h1>
              <h1 className="loading-effect">.</h1>
            </div>
          </section> :
          pokemons.map((pokemon, index) => 
            <Fragment key={ pokemon.id }>
              <Pokemon 
                name={ pokemon.name } 
                src={ pokemon.src } 
                openPokemonModal={ openPokemonModal }
                ref={ self => pokemonSectionRefs.current[index] = self as HTMLElement }
              />
            </Fragment>
          )
      }

      {
        pokemonModals.map(({ display, style }, index) => {
          const { 
            name, src, height, weight, types, moves, abilities, stats 
          } = pokemons[index]

          const pokemonModalProps = { 
            name, src, height, weight, types, moves, 
            abilities, stats, style, closePokemonModal
          }

          return display && <PokemonModal key={ index } { ...pokemonModalProps } />
        })
      }

      <div className="toggle-page">
        <button 
          onClick={ getPreviousPokemons }
          style={ previousPokemonsUrl ? {} : { cursor: "no-drop" }}
        >
          Previous
        </button>

        <button 
          onClick={ getNextPokemons }
          style={ nextPokemonsUrl ? {} : { cursor: "no-drop" }}
        >
          Next
        </button>
      </div>
    </main>
  </> 
}