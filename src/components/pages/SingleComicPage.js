import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [data, setData] = useState(null);

    const {getComic, clearError, process, setProcess} = useMarvelService();
   
    useEffect(() => {
        updateComic();
    }, [comicId])



    const updateComic = () => {   
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
            .then(() => setProcess('confirmed'))
        }

    const onComicLoaded = (data) => {
        setData(data);
        return data;
    }

    return (
        <>
            {setContent(process, View, data)}
        </>
    )
}

const View = ({data}) => {
    const {title, description, pageCount, thumbnail, language, price} = data;
    // const {id} = comic;
    console.log(language);
    console.log(description);
    console.log(title);
    console.log(price);
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount} pages</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to='/comics' className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;