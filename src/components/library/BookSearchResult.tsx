import { Book, LibraryAdd, LibraryAddCheck} from "@mui/icons-material"
import { Avatar, Box, Button, Chip, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, useMediaQuery } from "@mui/material"
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
        <Box className="flex align-middle justify-center mr-7">
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
        </Box>
    )   

    return (
        book &&
            <ListItem secondaryAction={secondaryAction}
                key={book.id} className="my-1 bg-primary rounded-lg max-w-full h-fit p-0" alignItems="flex-start" disableGutters>
                <ListItemButton className="h-16 px-2 py-0" onClick={handleSelectBook}>
                    <ListItemAvatar>
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
                        className=""
                        primary={
                            "title" in book
                            ? <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{book?.title || ""}</span>
                            : <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{book?.volumeInfo?.title || ""}</span>
                        }
                        secondary={
                            "author" in book
                            ? <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{book?.author || ""}</span>
                            : <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{book?.volumeInfo?.authors?.join(", ") || ""}</span>
                        }/>
                </ListItemButton>
            </ListItem>
    )
}