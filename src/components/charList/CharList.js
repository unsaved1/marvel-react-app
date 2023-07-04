import { Component } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';

import MarvelService from '../../services/MarvelService';
import CharImage from '../charImage/CharImage';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1544,
        charEnded: false
    }


    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newChars) => {
        let ended = false;

        if (newChars.length < 9) {
            ended = true;
        }


        this.setState(({chars, offset}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemsRefs = []

    setRef = (ref) => {
        this.itemsRefs.push(ref)
    }

    focusOnItem = (id) => {
        this.itemsRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemsRefs[id].classList.add('char__item_selected')
    }

    render() {
        const {chars, loading, error, newItemLoading, offset, charEnded} = this.state;

        const setAllChars = (chars) => {
            if (chars.length > 0) {
                const charsArr = chars.map((item, i) => {
                    return (
                        <li 
                        className={item.className} 
                        ref={this.setRef} 
                        tabIndex='0' 
                        key={item.id} 
                        onClick={() => {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                this.props.onCharSelected(item.id);
                                this.focusOnItem(i);
                            }
                        }}>
                            <CharImage src={item.thumbnail}/>
                            <div className="char__name">{item.name}</div>
                        </li>
                    )
                });

                return [...charsArr];
            }
        }

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? setAllChars(chars) : null

        return (
            <div className="char__list">
                {spinner}
                <ul className="char__grid">
                    {errorMessage}
                    {content}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{display: charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;