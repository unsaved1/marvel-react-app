import {useEffect, useState} from 'react';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import CharImage from '../charImage/CharImage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [char, setChar] = useState(null);

    useEffect(() => {
        updateChar();
    }, [])

    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(setDescr)
            .then(onCharLoaded)
            .then(() =>  setProcess('confirmed'))        
    }

    const onCharLoaded = (char) => {
        setChar(char);
        return char;
    }


    const setDescr = (char) => {
        const newDescr = 'данные о персонаже отсутствуют'
        if (char.description === '') {
            char.description = newDescr;
        }

        if (char.description.length >= 100) {
            char.description = char.description.slice(0, 180) + '...'
        }
        
        return char;
    }

    return (
        <div className="randomchar">
            {setContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main">
                    <div onClick={updateChar} className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki} = data;
    return (
        <div className="randomchar__block">
            <CharImage src={thumbnail} alt={name} className='randomchar__img'/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;