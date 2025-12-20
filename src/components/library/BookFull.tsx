import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { bchApi } from "../../api/bchBooksClient"
import { useNavigate } from "react-router-dom"
import type { ClubBook } from "../clubs/Club"
import { Book } from "@mui/icons-material"

type BookFullProps = {
    book: UserBook | GoogleBook,
    clubId?: number | null,
    setBook?: React.Dispatch<React.SetStateAction<UserBook | GoogleBook | null>>,
    user?: number,
    refetch?: () => void
}

// Renders the full details of a component
export const BookFull = ({book, clubId, setBook, user, refetch}: BookFullProps) => {
    const [open, setOpen] = useState(false)
    const [inLibrary, setInLibrary] = useState(false)
    const [clubBookId, setClubBookId] = useState(null)
    const [bookId, setBookId] = useState(null)
    const {request} = bchApi

    const navigate = useNavigate()

    let thumbnail
    let title
    let author
    let description
    
    "volumeInfo" in book 
    ?( 
        thumbnail = book.volumeInfo.imageLinks?.thumbnail || "", 
        title = book.volumeInfo?.title || "",
        author = book.volumeInfo?.authors?.join(", ") || "",
        description = book.volumeInfo?.description || ""
    )
    : (
        thumbnail = book?.imageLarge || "",
        title = book?.title || "",
        author = book?.author || "",
        description = book?.description || ""
    ) 

    const addBookToLibrary = () => {
        "volumeInfo" in book &&
        request("", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                googleId: book.id,
                userId: user,
                title: title,
                author: author,
                imageSmall: book.volumeInfo.imageLinks.smallThumbnail,
                imageLarge: thumbnail,
                description: description,
                addedOn: Date.now(),
                status: "Not Started"
            }
        }).then((res) => 
        {
            setInLibrary(true)
            setBookId(res.id)
            refetch && refetch()
        }
        )
    }

    const handleRemoveBook = () => {
        const id = ("googleId" in book)
        ? book.id
        : bookId
       request(`/${id}`, {method: "DELETE"})
       setOpen(false)
        setBook && setBook(null)
        setInLibrary(false)
        refetch && refetch()
    }

    const addClubBook = async () => {
        await fetch(`http://localhost:8088/clubBooks?clubId=${clubId}&isCurrent=true`)
        .then(res => res.json())
        .then(async res => {
            await Promise.all(
            res.map((book: ClubBook) =>
                fetch(`http://localhost:8088/clubBooks/${book.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCurrent: false }),
                })
            )
            );
        });
        if (!inLibrary && "volumeInfo" in book) {
            fetch("http://localhost:8088/clubBooks", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                googleId: book.id,
                clubId: Number(clubId),
                title: title,
                author: author,
                imageSmall: book.volumeInfo.imageLinks.smallThumbnail,
                imageLarge: thumbnail,
                description: description,
                addedOn: Date.now(),
                isCurrent: true
            })
        }).then(() => navigate(`/clubs/${clubId}`) )

        } else {
            fetch(`http://localhost:8088/clubBooks/${clubBookId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isCurrent: true
                })
            }).then(() =>  navigate(`/clubs/${clubId}`) )
        }
    }

    useEffect(() => {
        !clubId
        ? "volumeInfo" in book
            ? request(`?googleId=${book.id}&userId=${user}`).then(res => {
                if (res.length > 0) {
                    setInLibrary(true)
                    setBookId(res[0].id)
                } else {
                    setInLibrary(false)
                }
                })
            : setInLibrary(true)
        : fetch(`http://localhost:8088/clubBooks?clubId=${clubId}&googleId=${book.id}`).
        then(res => res.json()).then(res => {
            if (res.length > 0) {
                setInLibrary(true)
                setClubBookId(res[0].id)
            } else {
                setInLibrary(false)
            }
        })
    },[book])


    return (
        book &&
        <Box className="flex w-fit" >
            <Box className="flex flex-col md:flex-row m-5">
                <Box className="h-163 mr-5">
                    { thumbnail !== "" ?
                        <img className="w-full h-full object-contain rounded-lg" src={thumbnail}/>
                        : <></>
                        }
                </Box>
                <Box className="flex flex-col shrink w-[50%] max-h-auto">
                    <Box className="pb-2">
                        {!clubId 
                            ? inLibrary
                             ?<Button onClick={() => setOpen(true)} variant="contained" color="warning" size="small">Remove From Library</Button>
                             : user ? <Button onClick={addBookToLibrary} variant="contained" size="small">Add to Library</Button>
                                    : <></>
                            : <Button onClick={addClubBook} variant="contained" size="small">Set as Current Book</Button>
                        }
                    </Box>
                    <Box className="flex flex-col bg-black rounded-lg p-5 max-w-150">
                        <Typography className="dark:text-white" variant="h5">{title}</Typography>
                        <Typography className="dark:text-white" variant="subtitle2">{author}</Typography>
                        <Typography
                            className="dark:text-white overflow-y-scroll no-scrollbar max-h-130"
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