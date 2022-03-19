import { Component } from "react"
import "../styles/pokemon.css"

interface IPokemon {
  readonly name: string
  readonly url: string
}

interface IPokemonState {
  readonly pokemons: IPokemon[]
  readonly nextPokemonsPage: IPokemonState
  readonly previousPokemonsPage: IPokemonState
}

class Pokemon extends Component {
  state: IPokemonState = { 
    pokemons: [],
    nextPokemonsPage: {} as IPokemonState,
    previousPokemonsPage: {} as IPokemonState
  }

  pokemonApiUrl = "https://pokeapi.co/api/v2/pokemon"

  async getJSON(url: string) {
    try {
      const response = await fetch(url, { method: "GET" })
      const json = await response.json()

      return json
    } catch {
      return null 
    }
  }

  async getNextPokemonsPage(nextUrl: string) {
    const nextPokemonsPage = await this.getJSON(nextUrl)
    return nextPokemonsPage
  }

  async getPreviousPokemonsPage(previousUrl: string) {
    const previousPokemonsPage = await this.getJSON(previousUrl)
    return previousPokemonsPage
  }

  nextPokemonsPage() {
    const state = this.state
    const nextPokemonsPage = state.nextPokemonsPage

    this.setState({
      ...state,
      previousPokemonPage: state,
      nextPokemonPage: nextPokemonsPage.nextPokemonsPage,
      pokemons: nextPokemonsPage
    })
  }

  previousPokemonsPage() {
    const state = this.state
    const previousPokemonsPage = state.previousPokemonsPage

    this.setState({
      ...state,
      previousPokemonPage: previousPokemonsPage.previousPokemonsPage,
      nextPokemonPage: state,
      pokemons: previousPokemonsPage
    })

  }

  componentDidMount() {
    const getJSON = this.getJSON
    const state = this.state

    getJSON(this.pokemonApiUrl).then(async ({ 
      results, 
      next: nextUrl, 
      previous: previousUrl
   }) => {
      const pokemons = state.pokemons
      const newState = {
        ...state,
        pokemons: [...pokemons, ...results],
        nextPokemonsPage: this.getNextPokemonsPage(nextUrl),
        previousPokemonsPage: this.getPreviousPokemonsPage(previousUrl)
      }

      return this.setState(newState)
    })
  }

  render() {
    const state = this.state

    return <div id="pokemon">
      <ol>
        {
          state.pokemons?.map((pokemon, index) => <li key={ index }>
            { pokemon.name }
          </li>)
        }
      </ol>

      <div className="toggle-page">
        <button onClick={ this.previousPokemonsPage.bind(this) }>Previous</button>
        <button onClick={ this.nextPokemonsPage.bind(this) }>Next</button>
      </div>
    </div> 
  }
}

export default Pokemon;