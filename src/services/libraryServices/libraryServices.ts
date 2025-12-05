export const getLibrary = async (userId: number) => {
    const books = fetch(`http://localhost:8088/userBooks?userId=${userId}`).then(res => res.json())

    return books
}

export const addBookToLibrary = async(userId: number, book: GoogleBook) => {

    const transformedBook = transformBook(book)

    const response = fetch("http://localhost:8088/userBooks", {
        method: "POST",
        headers: {
            "Content-Type": "application.json"
        },
        body: JSON.stringify({...transformedBook, userId: userId, addedOn: Date.now(), status: "Not Started"})
    }).then(res => res.json())

    return response
}

const transformBook = (book: GoogleBook) => {
    const b = book.volumeInfo
    
    return {
        "title": b.title,
        "imageSmall": b.imageLinks.smallThumbnail || null,
        "imageLarge": b.imageLinks.thumbnail || null,
        "description": b.description || null
    }
}