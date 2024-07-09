function searchBooks(library, authorName) {
    const Titles = [];

    for (let i = 0; i < library.length; i++) {
        if (library[i].author === authorName) {
            Titles.push(library[i].title);
        }
    }
    
    if (Titles.length < 1) {
        return 'NOT FOUND';
    }  else {
        return Titles.join(',');
    }
}