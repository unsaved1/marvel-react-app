import { useEffect, useState } from 'react';

import CharImage from '../charImage/CharImage';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import comicsItemImg from '../../resources/img/UW.png';

import './comicsItems.scss';
import { Link } from 'react-router-dom';

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


const ComicsItems = () => {
    const [comics, setComics]                 = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset]                 = useState(1544);
    const [comicsEnded, setComicsEnded]       = useState(false);

    const {loading, error, getAllComics, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onComicsListLoaded = (newComics) => {
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }


        setComics(comics => [...comics, ...newComics]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }


    const setAllComics = (comics) => {
        if (comics.length > 0) {
            const comicsArr = comics.map((item, i) => {
                return (
                    <Link to={`/comics/${item.id}`}>
                        <li className='comicsItems__item'
                            key={item.id}>
                            <img src={item.thumbnail} alt="item"/>
                            <h2 className="comicsItems__title">{item.name}</h2>
                            <h2 className="comicsItems__price">{item.price}</h2>
                        </li>
                    </Link>
                )
            });

            return (<ul className="comicsItems__grid" style={+window.innerWidth <= 576 ? {width: window.innerWidth - +'20'}: {width: 'auto'}}>
                        {[...comicsArr]}
                    </ul>)
        }
    }

    return (
        <div className="comicsItems">
            {setContent(process, () => setAllComics(comics), newItemLoading)} 
            <button 
                className="button button__main button__long"
                disabled={newItemLoading} 
                style={{display: comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    ) 
}

export default ComicsItems;