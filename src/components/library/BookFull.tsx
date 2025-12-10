import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material"
import { useState } from "react"
import { bchApi } from "../../api/bchBooksClient"

type BookFullProps = {
    book: UserBook | GoogleBook,
    setBook: React.Dispatch<React.SetStateAction<UserBook | null>>
}

export const BookFull = ({book, setBook}: BookFullProps) => {
    const [open, setOpen] = useState(false)
    const {request} = bchApi




    let thumbnail
    let title
    let author
    let description
    
    "volumeInfo" in book 
    ?( 
        thumbnail = book.volumeInfo.imageLinks?.thumbnail || "", 
        title = book.volumeInfo?.title || "",
        author = book.volumeInfo?.authors.join(", ") || "",
        description = book.volumeInfo?.description || ""
    )
    : (
        thumbnail = book?.imageLarge || "",
        title = book?.title || "",
        author = book?.author || "",
        description = book?.description || ""
    ) 

    const handleRemoveBook = () => {
       request(`/${book.id}`, {method: "DELETE"})
       setOpen(false)
        setBook(null)
    }


    return (
        book &&
        <Box>
            <Box className="flex md:flex-row m-5 max-h-[60%]">
                <Box className="grow w-[50%] mr-5">
                    <img className="w-full h-full object-contain" src={thumbnail}/>
                </Box>
                <Box className="flex flex-col shrink w-[50%] max-h-auto">
                    <Box className="pb-2">
                        {"userId" in book &&
                            <Button onClick={() => setOpen(true)} variant="contained" size="small">Remove From Library</Button>
                        }
                    </Box>
                    <Box>
                        <Typography className="dark:text-white" variant="h5">{title}</Typography>
                        <Typography className="dark:text-white" variant="subtitle2">{author}</Typography>
                        <Typography
                            className="dark:text-white overflow-y-scroll no-scrollbar max-h-75"
                            variant="body2"
                            dangerouslySetInnerHTML={{
                                __html: description
                            }}
                            />
                    </Box>
                </Box>
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                            Remove book from your Library?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                             Are you sure you wish to remove this book from your library? Any tracking data like progression will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleRemoveBook}>Remove</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}