import * as watchlistAction from '../../store/watchlist';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const NewWatchList = ({openForm, setOpenForm}) => {
    const [name, setName] = useState('');
    const [validationError, setValidationError] = useState('');
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
        e.preventDefault();

        setValidationError([]);

        if (name.length > 64) {
          setValidationError('List name must be less than 64 characters');
          return;
        }

        if (name.trim() === "") {
          setValidationError('List name cannot be blank!!!');
          return;
        }

        try {

          const response = await dispatch(watchlistAction.createWatchlist(name));

          if (response) {

            setName('');
            setOpenForm(false);
          }
        } catch (err) {
          setValidationError(err);
        }
      };

    const handleCancelButton = (e) => {
        openForm === false ? setOpenForm(true):setOpenForm(false)
    }
    return (
        <div className='newform-container'>
            <form onSubmit={handleSubmit}>
                <div className='newform-content'>
                    <div className='newform-content-head'>
                        <div className='watchlistform-icon'>
                            <img src="https://cdn.robinhood.com/emoji/v0/128/1f4a1.png"/>
                        </div>
                            <div className='newform-info'>
                                <label>
                                    <input
                                        type='text'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder='List Name'
                                        required
                                    />
                                </label>
                            </div>
                    </div>
                    {validationError && <li className='newform-error'>{validationError}</li>}
                    <div className='newform-button'>
                        <button type='button' className='btn-cancel-form'onClick={handleCancelButton}>Cancel</button>
                        <button className='btn-submit'type='submit'>Create List</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default NewWatchList
