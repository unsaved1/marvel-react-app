const CharImage = ({alt = null, src = null, className = null}) => {
    if (src === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        return <img src={src} style={{objectFit: 'fill'}} alt={alt} className={className}/>;
    }
    return <img src={src} style={{objectFit: 'cover'}} alt={alt} className={className}/>;
};

export default CharImage;