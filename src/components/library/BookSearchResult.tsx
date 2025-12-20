import { Book, LibraryAdd, LibraryAddCheck} from "@mui/icons-material"
import { Avatar, Box, Button, Chip, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useMediaQuery } from "@mui/material"
import { addBookToLibrary } from "../../services/libraryServices/libraryServices"
import { useNavigate } from "react-router-dom"

export type GoogleBookWithInLibrary = GoogleBook & { inLibrary?: boolean}
type BookSearchResultProps = {
    user?: number | null
    book: GoogleBookWithInLibrary | GoogleBook | UserBook | null
    update?: (id:string) => void
    setBook?:React.Dispatch<React.SetStateAction<GoogleBookWithInLibrary | GoogleBook | UserBook | null>>
}

//The List Item for a book search result
export const BookSearchResult = ({user, book, update, setBook}: BookSearchResultProps) => {
    const isMedium = useMediaQuery(`(min-width:640px)`)
    const navigate = useNavigate()
    // TODO: Add a navigate flag to determine if button click will navigate to detail page or not
    // const navigate = useNavigate()

    const handleAddBook = async () => {
        if (!user || book && !("inLibrary" in book || !update)) return
        if (book && "inLibrary" in book) {
            const {inLibrary, ...data} = book
            update && addBookToLibrary(user, data).then((res) => update(res.googleId))
        }
    }

    const handleSelectBook = () => {
        setBook && book && setBook(book)
        !setBook && navigate(`/books/google/${book.googleId}`)
    }

    const secondaryAction = (
        book && "inLibrary" in book &&
        <div className="flex items-center justify-center mr-7">
{            isMedium
            ? book.inLibrary
              ? <Chip label="In Library"/>
              : <Button onClick={handleAddBook} variant="contained">Add to Library</Button>
            :
              book.inLibrary
              ? <LibraryAddCheck/>
              : <IconButton onClick={handleAddBook}>
                    <LibraryAdd/>
                </IconButton>}
        </div>
    )   

    return (
        book &&
            <ListItem 
                secondaryAction={secondaryAction}
                key={book.id} 
                alignItems="flex-start" 
                disableGutters
                sx={{
                    my: 0.5,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    width: '100%',
                    maxWidth: '100%',
                    '&:hover': {
                        bgcolor: 'action.selected',
                    }
                }}
            >
                <ListItemButton 
                    sx={{ 
                        px: 2, 
                        py: 1,
                        width: '100%',
                        minWidth: 0,
                    }} 
                    onClick={handleSelectBook}
                >
                    <ListItemAvatar sx={{ minWidth: 56, flexShrink: 0 }}>
                        <Avatar
                            src={
                                "imageSmall" in book
                                ? book?.imageSmall || ""
                                : book?.volumeInfo?.imageLinks?.smallThumbnail || ""
                            }
                            variant="rounded"
                        >
                            <Book/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            pr: 2,
                        }}
                        primary={
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap',
                                    width: '100%',
                                }}
                            >
                                {"title" in book ? book?.title || "" : book?.volumeInfo?.title || ""}
                            </Typography>
                        }
                        secondary={
                            <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap',
                                    width: '100%',
                                }}
                            >
                                {"author" in book ? book?.author || "" : book?.volumeInfo?.authors?.join(", ") || ""}
                            </Typography>
                        }
                    />
                </ListItemButton>
            </ListItem>
    )
}