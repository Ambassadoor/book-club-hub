import { Box, Card, CardMedia, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getBook } from "../../services/libraryServices/libraryServices"

type BookParams = {
    bookId: string
}

export const Book = ({bookId}: BookParams) => {
    //TODO: Determine whether to get info from local API or Books API
    const [book, setBook] = useState<UserBook | GoogleBook>()

    useEffect(() => {
        bookId &&
        getBook(bookId).then(res => setBook(res))
    }, [bookId])

    return (
        book !== undefined &&
        <Card className="flex flex-row max-w-[80%] self-center">
            <CardMedia
                className="book-cover object-contain mx-5"
                component="img"
                image={
                    "imageLarge" in book
                    ? book.imageLarge
                    : book.volumeInfo.imageLinks.thumbnail
                }
                alt={`Book cover-art for ${
                    "title" in book
                    ? book.title
                    : book.volumeInfo.title}`}
            
            />
            <Box className="flex flex-col p-5 max-h-auto">
                    <Typography variant="h5">{
                        "title" in book
                        ? book.title
                        : book.volumeInfo.title
                        }
                    </Typography>
                    <Typography className="ml-5 mb-2" variant="subtitle1">
                        {
                            "author" in book
                            ? book.author
                            : book.volumeInfo.authors.join(", ")
                        }
                    </Typography>
                    <Typography className="ml-5 overflow-y-scroll" variant="body1">
                        {
                            "description" in book
                            ? book.description
                            : book.volumeInfo.description
                        }
                    </Typography>

                    
            </Box>
        </Card>
    )
}