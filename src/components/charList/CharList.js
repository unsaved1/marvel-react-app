import {useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';


import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import CharImage from '../charImage/CharImage';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
            break;
        case 'confirmed': 
            return <Component/>;
            break;
        case 'error':
            return <ErrorMessage/>;
            break;
        default:
            throw new Error('Unexpected process state');
    }
};


const CharList = ({onCharSelected}) => {
    const [chars, setChars]                   = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset]                 = useState(1544);
    const [charEnded, setCharEnded]           = useState(false);

    const {loading, error, getAllCharacters, process, setProcess}  = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true) 
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newChars) => {
        let ended = false;

        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset+9);
        setCharEnded(charEnded => ended);
    }

    const itemsRefs = useRef([]);

    const focusOnItem = (id) => {
        itemsRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRefs.current[id].classList.add('char__item_selected');
    }


    const setAllChars = (chars) => {
        if (chars.length > 0) {
            const charsArr = chars.map((item, i) => {
                return (
                    <li 
                    className={item.className} 
                    ref={(el) => itemsRefs.current[i] = el} 
                    tabIndex='0' 
                    key={item.id} 
                    onClick={() => {
                        onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                        <CharImage src={item.thumbnail}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                )
            });

            return (
                <ul className="char__grid" style={+window.innerWidth <= 576 ? {width: window.innerWidth - +'20'}: {width: 'unset'}}>
                    {[...charsArr]}
                </ul>
            );
        }
    }

    return (
        <div className="char__list">
            {setContent(process, () => setAllChars(chars), newItemLoading)} 
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;