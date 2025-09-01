import './SearchBar.css';

function SearchBar( { buscar } ){

    const handleSearch = (event) => {
        const busqueda = event.target.value
        buscar(busqueda)
    }

    return(
        <div className='search-bar'>
            <form action="" name="formulario" className="search-form">
                <label for="buscar"></label>
                <input type="text" name="buscar" placeholder="BUSCAR" id="buscar" className='input-buscador' onChange={handleSearch}/>
            </form>
        </div>
    );
}

export default SearchBar;