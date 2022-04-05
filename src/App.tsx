import { BrowserRouter, Routes, Route  } from "react-router-dom"
import { PokemonContextProvider } from "./context/PokemonContext"
import Header from "./components/Header"
import Main from "./components/Main"

export default function App() {
  return <PokemonContextProvider>
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={ <Main /> } />
      </Routes>
    </BrowserRouter> 
  </PokemonContextProvider>
}