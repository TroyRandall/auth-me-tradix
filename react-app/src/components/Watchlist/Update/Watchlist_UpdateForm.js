import * as watchlistAction from '../../../store/watchlist';
import { useDispatch } from 'react-redux';
import {  useState } from 'react';


const UpdateWatchlistForm = ({watchlist, onClose}) => {
    const id = watchlist.id;
    const [name, setName] = useState(watchlist.name);
    const [validationError, setValidationError] = useState([]);
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');
        if (name.length > 64) {
            return setValidationError('List name must be less than 64 characters.');
        }
        if (name.trim() === "") {
            return setValidationError('List name can not be blank.')
        }
        try {

            const response = await dispatch(watchlistAction.updateWatchlist({ name, id }));

            if (response) {
              onClose();
            }
          } catch (error) {

            if (error.response) {
              const data = await error.response.json();
              if (data && data.errors) {
                const err = Object.values(data.errors);
                setValidationError(err[0]);
              }
            } else {

              console.error("An unexpected error occurred:", error);
            }
          }
        }
    const handleClose = (e) => {
        e.stopPropagation()
        onClose();
    }

    return (
        <div className='updateform-container'>
            <form onSubmit={handleSubmit}>
                <div className='updateform-header'>
                    <div>Edit List</div>
                    <button type='button'className='btn-close' onClick={handleClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className='updateform-content'>
                    <div className='watchlist-icon'>
                        <img src="https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"/>
                    </div>
                    <div className='updateform-info'>
                        <label>
                            <input className='updateform-input'
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='List Name'
                                required
                            />
                        </label>
                    </div>
                </div>
                {validationError &&
                    <div className='updateform-error'>
                        {validationError}
                    </div>
                }
                <div className='updateform-btnsave'>
                    <button type='submit' className='btn-save'>Save</button>
                </div>
            </form>
        </div>
    );
}


export default UpdateWatchlistForm;
