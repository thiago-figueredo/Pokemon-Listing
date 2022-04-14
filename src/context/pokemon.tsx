import { 
  useState,
  Dispatch,
  ReactNode, 
  useCallback,
  CSSProperties, 
  createContext, 
  SetStateAction
} from "react"
import { 
  IPokemon, 
  IPokeApiPokemon, 
  IPokeApiResponse, 
  IPokemonState, 
} from "../interfaces/pokemon"
import useLocalStorage, { SetLocalStorage } from "../hooks/useLocalStorage"

export interface IPokemonModal {
  readonly display: boolean
  readonly style: CSSProperties
}

export interface IPokemonLocalStorage {
  readonly pokemon: IPokemon
}

interface IPokemonContextState {
  readonly pokemons: IPokemon[]
  readonly loading: boolean
  readonly previousPokemonsUrl: string
  readonly nextPokemonsUrl: string
  readonly profileImage: string
}

interface IGetPokemonArgs {
  readonly id?: number
  readonly name?: string
}

export interface IPokemonContext extends IPokemonContextState {
  readonly setState: Dispatch<SetStateAction<IPokemonContextState>>
  readonly localStorage: IPokemonLocalStorage
  readonly setLocalStorage: SetLocalStorage<IPokemonLocalStorage>
  readonly loadPokemonsData: (url?: string) => Promise<IPokemonState>
  readonly getPreviousPokemons: () => void
  readonly getNextPokemons: () => void
  readonly setPokemonToLocalStorage: (id: number) => Promise<void>
  readonly getPokemon: (args: IGetPokemonArgs) => Promise<Partial<IPokemon> | null>
}

export const initialPokemonState: IPokemonContextState = {
  loading: true,
  profileImage: "",
  pokemons: [],
  previousPokemonsUrl: "",
  nextPokemonsUrl: ""
}

const initialLocalStorage: IPokemonLocalStorage = {
  pokemon: {} as IPokemon
}

export const pokeApiURL = "https://pokeapi.co/api/v2/pokemon"

const initialContextState: IPokemonContext = { 
  ...initialPokemonState, 
  localStorage: initialLocalStorage,
  setState: () => {},
  setLocalStorage: () => {},
  loadPokemonsData: async (url?: string) => ({}) as IPokemonState,
  setPokemonToLocalStorage: async (id: number) => {},
  getPreviousPokemons: () => {},
  getNextPokemons: () => {},
  getPokemon: async (args: IGetPokemonArgs) => ({} as IPokemon)
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

export async function getPokemonImage(
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
  const [localStorage, setLocalStorage] = useLocalStorage("pokemon", initialLocalStorage)
  const { previousPokemonsUrl, nextPokemonsUrl } = state

  const loadPokemonsData = useCallback(async (url = pokeApiURL) => {
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
      return { 
        pokemons: [], 
        nextPokemonsUrl: "", 
        previousPokemonsUrl: "" 
      } 
    }
  }, [])

  const getPreviousPokemons = async () => {
    if (previousPokemonsUrl) {
      setState(oldState => ({ ...oldState, loading: true }))

      const pokemonData = await loadPokemonsData(previousPokemonsUrl)

      setState(oldState => ({ ...oldState, ...pokemonData }))
      setState(oldState => ({ ...oldState, loading: false }))
    }
  }

  const getNextPokemons = async () => {
    if (nextPokemonsUrl) {
      setState(oldState => ({ ...oldState, loading: true }))

      const pokemonData = await loadPokemonsData(nextPokemonsUrl)

      setState(oldState => ({ ...oldState, ...pokemonData }))
      setState(oldState => ({ ...oldState, loading: false }))
    }
  }

  const getPokemon = useCallback(async ({ id, name }: IGetPokemonArgs) => {
    try {
      const pokeApiPokemon: IPokeApiPokemon = await getJSON(
        `${pokeApiURL}/${id ? id : name ? name : "" }`)

      const pokemon = {
        id: pokeApiPokemon.id,
        weight: pokeApiPokemon.weight, 
        height: pokeApiPokemon.height,
        name: pokeApiPokemon.name, 
        types: pokeApiPokemon.types.map(({ type }) => type.name),
        abilities: pokeApiPokemon.abilities.map(({ ability }) => ability.name),
        stats: pokeApiPokemon.stats.map(({ stat, ...rest }) => ({ 
          name: stat.name, 
          ...rest 
        })),
      }

      return pokemon 
    } catch {
      return null
    }
  }, [])

  const setPokemonToLocalStorage = useCallback(async (id: number) => {
    const pokemon = await getPokemon({ id }) as IPokemon
    const pokemonKeys = Object.keys(pokemon)

    if (!pokemonKeys.length) 
      return setLocalStorage(initialLocalStorage)

      setLocalStorage({ pokemon })
  }, [getPokemon, setLocalStorage])


  const value: IPokemonContext = { 
    ...state, 
    setState, 
    getPokemon,
    localStorage,
    setLocalStorage,
    getNextPokemons, 
    loadPokemonsData, 
    getPreviousPokemons, 
    setPokemonToLocalStorage,
  }

  return <PokemonContext.Provider value={ value }>
    { children }
  </PokemonContext.Provider>
}

export default PokemonContext