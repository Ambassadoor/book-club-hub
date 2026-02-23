import { Book, LibraryAdd, LibraryAddCheck} from "@mui/icons-material"
import { Avatar, Box, Button, Chip, Divider, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, useMediaQuery } from "@mui/material"
import { addBookToLibrary } from "../../services/libraryServices/libraryServices"
import { useNavigate } from "react-router-dom"
import { useLayoutEffect, useRef, useState } from "react"

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
        const id = "googleId" in book ? book.googleId : book.id
        setBook && book && setBook(book)
        !setBook && navigate(`/books/google/${id}`)
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
        <>
            <ListItem 
                secondaryAction={secondaryAction}
                key={book.id} 
                alignItems="flex-start" 
                disableGutters
                sx={{
                    bgcolor: 'background.paper',                    
                    '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main'
                    }
                }}
            >
                <ListItemButton 
                    sx={{ 
                        width: '100%',
                        minWidth: 0,
                        ":hover": {
                            bgcolor: 'rgba(0, 0, 0, 0)'
                        }
                    }} 
                    onClick={handleSelectBook}
                >
                    <ListItemAvatar sx={{ minWidth: 56, flexShrink: 0,}}>
                        <Avatar
                            sx={{
                                height: 75, width: 50
                            }}
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
                            px: 2,
                        }}
                        primary={"title" in book ? book?.title || "" : book?.volumeInfo?.title || ""}
                        secondary={"author" in book ? book?.author || "" : book?.volumeInfo?.authors?.join(", ") || ""}
                        slotProps={{
                            primary: {
                                variant: "body2",
                                sx: {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }
                            },
                            secondary: {
                                variant: "caption",
                                sx: {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }
                            }
                        }}
                    />
                </ListItemButton>
            </ListItem>
            <Divider/>
            </>
    )
}