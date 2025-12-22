import { Box, Button, ButtonGroup, Card, CardMedia, Typography, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
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

    const location = useLocation();

    const isMedium = useMediaQuery(`(min-width:640px)`)

    useEffect(() => {
        if (location.state.id) setBook(location.state)
        else if (bookId) {
            getBook(bookId).then(res => setBook(res))
        }
    }, [bookId, location])

    const [display, setDisplay] = useState("Full")

    const handleButtonClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setDisplay(e.currentTarget.value)
    }



    return (
        <Box 
            sx={{ 
                maxWidth: 1200, 
                mx: 'auto', 
                p: 4,
            }}
        >
            {/* Development tool - uncomment to test different display modes */}
            {/* <Box sx={{ mb: 2 }}>
                <ButtonGroup>
                    <Button color="secondary" variant="contained" value="Full" onClick={handleButtonClick}>Full</Button>
                    <Button color="secondary" variant="contained" value="Card" onClick={handleButtonClick}>Card</Button>
                    <Button color="secondary" variant="contained" value="Search" onClick={handleButtonClick}>Search Result</Button>
                </ButtonGroup>
            </Box> */}
            
            {book !== undefined && display === "Card" ? (
                <Card 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' },
                        maxWidth: { xs: '100%', md: '80%' },
                        mx: 'auto',
                        border: 1,
                        borderColor: 'divider',
                    }}
                >
                    <CardMedia
                        component="img"
                        image={
                            "imageLarge" in book
                            ? isMedium ? book.imageLarge : book.imageSmall
                            : isMedium 
                                ? book.volumeInfo.imageLinks?.thumbnail 
                                : book.volumeInfo.imageLinks?.smallThumbnail
                        }
                        alt={`Book cover for ${
                            "title" in book ? book.title : book.volumeInfo.title
                        }`}
                        sx={{
                            width: { xs: '100%', md: 250 },
                            height: { xs: 300, md: 'auto' },
                            objectFit: 'contain',
                            p: 2,
                        }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3, flex: 1, overflow: 'hidden' }}>
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                            {"title" in book ? book.title : book.volumeInfo.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                            {"author" in book ? book.author : book.volumeInfo.authors?.join(", ")}
                        </Typography>
                        <Typography
                            className="reading-text"
                            variant="body1"
                            color="text.primary"
                            component="div"
                            sx={{ 
                                overflow: 'auto',
                                flex: 1,
                            }}
                            dangerouslySetInnerHTML={{
                                __html: "description" in book 
                                    ? book.description 
                                    : book.volumeInfo.description
                            }}
                        />
                    </Box>
                </Card>
            ) : book !== undefined && display === "Full" ? (
                <BookFull book={book}/>
            ) : book !== undefined && display === "Search" ? (
                <BookSearchResult book={book}/>
            ) : null}
        </Box>
    )
}