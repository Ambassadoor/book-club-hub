import { Box, Button, ButtonGroup, Card, CardMedia, Typography, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getBook } from "../../services/libraryServices/libraryServices"
import { BookFull } from "./BookFull"
import { BookSearchResult } from "./BookSearchResult"

type BookParams = {
    bookId: string
}
//Card component for Book Details
//Unused currently
//TODO: Do we keep the source idea?
export const Book = () => {
    //TODO: Determine whether to get info from local API or Books API
    const [book, setBook] = useState<UserBook | GoogleBook>()
    const {source, bookId} = useParams()

    const isMedium = useMediaQuery(`(min-width:640px)`)

    useEffect(() => {
        bookId &&
        getBook(bookId).then(res => setBook(res))
    }, [bookId])

    const [display, setDisplay] = useState("Full")

    const handleButtonClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setDisplay(e.currentTarget.value)
    }



    return (
        <>
        <Box>
            <ButtonGroup>
                <Button color="secondary" variant="contained" value="Full" onClick={handleButtonClick}>Full</Button>
                <Button color="secondary" variant="contained" value="Card" onClick={handleButtonClick}>Card</Button>
                <Button color="secondary" variant="contained" value="Search" onClick={handleButtonClick}>Search Result</Button>
            </ButtonGroup>
        </Box>
            {book !== undefined &&
            display === "Card" ?
            <Card className="flex flex-row max-w-[80%] max-h-[33%] md:max-w-[50%] self-center">
                <CardMedia
                    className="book-cover md:object-contain mx-5"
                    component="img"
                    image={
                        "imageLarge" in book
                        ?
                            isMedium
                            ? book.imageLarge
                            : book.imageSmall
                        :
                            isMedium
                            ? book.volumeInfo.imageLinks?.thumbnail
                            : book.volumeInfo.imageLinks?.smallThumbnail
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
                                : book.volumeInfo.authors?.join(", ")
                            }
                        </Typography>
                        <Typography
                            className="ml-5 overflow-y-scroll"
                            variant="body1"
                            dangerouslySetInnerHTML={{
                                __html:
                                "description" in book
                                ? book.description
                                : book.volumeInfo.description
                            }}
                            >
                        </Typography>
            
                </Box>
            </Card>
            : book!== undefined && display === "Full" ? <BookFull book={book}/>
            : book!== undefined && display === "Search" && <BookSearchResult book={book}/>
            }
        </>
    )
}