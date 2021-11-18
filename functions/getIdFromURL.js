const getIdFromURL = (url) => {
    
    if(url[url.length - 1] == '/'){
        url = url.slice(0, url.length - 1)
    }

    let location = 0;
    for(let i = 0; i < url.length; i++){
        if(url[i] == '/'){
            location = i;
        }
    }
    location++;
    return url.slice(location, url.length);
}

module.exports = getIdFromURL;