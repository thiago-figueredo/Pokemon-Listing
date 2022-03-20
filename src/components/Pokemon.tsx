import { Component } from "react"
import "../styles/pokemon.css"

interface IPokemon {
  readonly name: string
  readonly url: string
}

interface IPokemonState {
  readonly pokemons: IPokemon[]
  readonly nextPokemonsUrl: string
  readonly previousPokemonsUrl: string
}

class Pokemon extends Component {
  state: IPokemonState = { 
    pokemons: [],
    nextPokemonsUrl: "",
    previousPokemonsUrl: ""
  }

  async loadPokemon(url: string = "https://pokeapi.co/api/v2/pokemon") {
    try {
      const response = await fetch(url)
      const { results, next, previous } = await response.json()

      this.setState({
        ...this.state,
        pokemons: results, 
        nextPokemonsUrl: next, 
        previousPokemonsUrl: previous
      })
    } catch {}
  }

  async previousPokemonsPage() {
    const state = this.state
    state.previousPokemonsUrl && await this.loadPokemon(state.previousPokemonsUrl)
  }

  async nextPokemonsPage() {
    const state = this.state
    state.nextPokemonsUrl && await this.loadPokemon(state.nextPokemonsUrl)
  }

  async componentDidMount() {
    await this.loadPokemon()
  }

  render() {
    return <div id="pokemon">
      {
        this.state?.pokemons?.map(({ name }, index) => 
          <section key={ index }>
            { name }
          </section>
        )
      }

      <div className="toggle-page">
        <button onClick={ this.previousPokemonsPage.bind(this) }>Previous</button>
        <button onClick={ this.nextPokemonsPage.bind(this) }>Next</button>
      </div>
    </div> 
  }
}

export default Pokemon;