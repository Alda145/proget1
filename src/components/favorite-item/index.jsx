
import { ThemeContext } from '../../App';
import { useContext } from 'react';
import './styles.css'

const FavoriteItem = (props) => {

    const { id, image, title, removeFromFavorites } = props
    const { theme } = useContext(ThemeContext);
    // console.log(props, 'recipe-item-props ');

    return (
        <div className="favorite-item" >
            <div>
                <img src={image} alt='image of recipe' />
            </div>
            <p style={theme ? { color: "#12343b" } : {}}>{title}</p>
            <button type='button' style={theme ? { backgroundColor: "#12343b" } : {}} onClick={removeFromFavorites}  >Remove  from favorites</button>

        </div>
    )
}
export default FavoriteItem;