import { useContext } from 'react';
import './styles.css';
import { useState, useEffect } from 'react';
import { ThemeContext } from '../../App';

const Search = ({ getDataFromSearchComponent, apiCalledSuccess, setApiCalledSuccess }) => {

    const [inputValue, setInputValue] = useState('');
    const { theme } = useContext(ThemeContext);

    const handleInputValue = (event) => {
        const { value } = event.target;
        setInputValue(value);
    }
    console.log(inputValue);

    const handleSubmit = (event) => {
        event.preventDefault();
        getDataFromSearchComponent(inputValue);

    }
    useEffect(() => {
        if (apiCalledSuccess) {
            setInputValue('');
            setApiCalledSuccess(false);
        }


    }, [apiCalledSuccess, setApiCalledSuccess])

    console.log(apiCalledSuccess);
    return (
        <form className='Search' onSubmit={handleSubmit} >
            <input
                name="search"
                placeholder="Search Recipies"
                id="search"
                value={inputValue}
                onChange={handleInputValue}
            />
            <button type="submit" style={theme ? { backgroundColor: "#12343b" } : {}} >Search</button>
        </form>

    )
}

export default Search