// Retrieves a user's books
export const getLibrary = async (userId: number) => {
    const books = fetch(`http://localhost:8088/userBooks?userId=${userId}`).then(res => res.json())

    return books
}

// Adds a book to a user's library
export const addBookToLibrary = async(userId: number, book: GoogleBook): Promise<UserBook> => {

    const transformedBook = transformBook(book)

    const response = fetch("http://localhost:8088/userBooks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({...transformedBook, userId: userId, addedOn: Date.now(), status: "Not Started"})
    }).then(res => res.json())

    return response
}

// Converts googleBook to userBook
const transformBook = (book: GoogleBook) => {
    const b = book.volumeInfo
    
    return {
        "title": b.title,
        "author": b.authors?.join(", ") || null,
        "imageSmall": b.imageLinks.smallThumbnail || null,
        "imageLarge": b.imageLinks.thumbnail || null,
        "description": b.description || null,
        "googleId": book.id
    }
}

//Gets book details from google API
export const getBook = async(googleId: string) => {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${googleId}`).then(res => res.json())
    return response
}