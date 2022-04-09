import { 
  CSSProperties, 
  createContext, 
  ReactNode, 
  useState,
  Dispatch,
  SetStateAction,
  useCallback
} from "react"
import { 
  IPokemon, 
  IPokeApiPokemon, 
  IPokeApiResponse, 
  IPokemonState 
} from "../interfaces/pokemon"
import useLocalStorage from "../hooks/useLocalStorage"

export interface IPokemonModal {
  readonly display: boolean
  readonly style: CSSProperties
}

export interface IPokemonContext {
  readonly state: IPokemonState
  readonly localStorage: IPokemonState
  readonly loading: boolean
  readonly pokeApiURL: string

  readonly setLoading: Dispatch<SetStateAction<boolean>>
  readonly setLocalStorage: Dispatch<SetStateAction<IPokemonState>>
  readonly setState: Dispatch<SetStateAction<IPokemonState>>
  readonly loadPokemonsData: (url?: string) => Promise<IPokemonState>
  readonly getPreviousPokemons: () => void
  readonly getNextPokemons: () => void
}

export const initialPokemonState: IPokemonState = {
  pokemons: [],
  previousPokemonsUrl: "",
  nextPokemonsUrl: "",
}

const initialContextState: IPokemonContext = { 
  state: initialPokemonState, 
  localStorage: initialPokemonState,
  loading: true,
  pokeApiURL: "",
  setLoading: () => {},
  setLocalStorage: (value: IPokemonState | ((oldValue: IPokemonState) => void)) => {},
  setState: () => {},
  loadPokemonsData: async (url?: string) => ({}) as IPokemonState,
  getPreviousPokemons: () => {},
  getNextPokemons: () => {}
}

const PokemonContext = createContext<IPokemonContext>(initialContextState)

interface IPokemonContextProviderProps {
  readonly children: ReactNode
}

async function getJSON(url: string) {
  const response = await fetch(url)
  return response.json()
}

export async function getPokemonProfileImage(url: string): Promise<string> {
  try {
    const { sprites } = await getJSON(url)
    const other = sprites.other
    const profileImageURL = other["official-artwork"]["front_default"]
    const profileImageResponse = await fetch(profileImageURL)
    const profileImageBlob = await profileImageResponse.blob()
    const profileImage = URL.createObjectURL(profileImageBlob as Blob)
    
    return profileImage
  } catch {
    return ""
  }
}

async function getPokemonImage(
  id: number,
  url: string = "https://pokeapi.co/api/v2/pokemon-form"
) {
  try {
    const { sprites } = await getJSON(`${url}/${id}`)
    const imageURL = sprites["front_default"]
    const response = await fetch(imageURL)
    const blob = await response.blob()
    const image = URL.createObjectURL(blob as Blob)

    return image
  } catch {
    return ""
  }
}

export function PokemonContextProvider(
  { children }: IPokemonContextProviderProps
) {
  const [state, setState] = useState(initialPokemonState)
  const [localStorage, setLocalStorage] = useLocalStorage("pokemonState", initialPokemonState)
  const [loading, setLoading] = useState(true)
  const { previousPokemonsUrl, nextPokemonsUrl } = localStorage
  const pokeApiURL = "https://pokeapi.co/api/v2/pokemon"

  const loadPokemonsData = useCallback<(url?: string) => Promise<IPokemonState>>(
    async (url = pokeApiURL) => {
      try {
        const { results, next, previous }: IPokeApiResponse = await getJSON(url)
        const getPokemon = async ({ name, url }: IPokeApiPokemon) => {
          const {
            id, moves, types, abilities, height, weight, stats
          }: IPokeApiPokemon = await getJSON(url)
          const smallImage = await getPokemonImage(id)
          const largeImage = await getPokemonProfileImage(url)

          return {
            height, weight, id, url, isDisplayed: false,
            name: name.at(0)?.toUpperCase() + name.slice(1), 
            image: { small: smallImage, large: largeImage },
            types: types.map(({ type }) => type.name),
            moves: moves.map(({ move }) => move.name),
            abilities: abilities.map(({ ability }) => ability.name),
            stats: stats.map(({ base_stat, effort, stat }) => 
              ({ base_stat, effort, name: stat.name }))
          } 
        }

      const pokemons: IPokemon[] = await Promise.all(results.map(getPokemon))
      return { pokemons, nextPokemonsUrl: next, previousPokemonsUrl: previous } 
      } catch {
        return { pokemons: [], nextPokemonsUrl: "", previousPokemonsUrl: "" } 
      }
  }, [])

  const getPreviousPokemons = async () => {
    if (previousPokemonsUrl) {
      setLoading(true)

      const pokemonData = await loadPokemonsData(previousPokemonsUrl)

      setState(pokemonData)
      setLocalStorage(pokemonData)
      setLoading(false)
    }
  }

  const getNextPokemons = async () => {
    if (nextPokemonsUrl) {
      setLoading(true)
      const pokemonData = await loadPokemonsData(nextPokemonsUrl)

      setState(pokemonData)
      setLocalStorage(pokemonData)
      setLoading(false)
    }
  }

  const value: IPokemonContext = { 
    state, 
    loading,
    setState, 
    pokeApiURL,
    setLoading,
    localStorage, 
    getNextPokemons, 
    loadPokemonsData, 
    getPreviousPokemons, 
    setLocalStorage
  }

  return <PokemonContext.Provider value={ value }>
    { children }
  </PokemonContext.Provider>
}

export default PokemonContext