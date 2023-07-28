import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=2e5979c797e0bfa0a23afd36e1caeab6';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    } 

    const getAllComics = async (offset = _baseOffset) => {
        // const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0])
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            className: 'char__item',
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0, 10)
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            className: 'comics__item',
            name: comics.series.name,
            title: comics.title,
            description: comics.description,
            language: comics.textObjects.language,
            pageCount: comics.pageCount,
            price: comics.prices.price,
       
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension, 
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic};
}
export default useMarvelService;