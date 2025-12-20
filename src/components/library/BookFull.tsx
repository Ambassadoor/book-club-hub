import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { bchApi } from "../../api/bchBooksClient"
import { useNavigate } from "react-router-dom"
import type { ClubBook } from "../clubs/Club"
import { Book } from "@mui/icons-material"
import { TextCollapse } from "../shared/TextCollapse"

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
    const [expanded, setExpanded] = useState(false)

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
        <div className="flex flex-col w-full h-full overflow-y-auto p-4">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="shrink-0 flex justify-center lg:justify-start">
                    { thumbnail !== "" ?
                        <img 
                            className="rounded-lg shadow-md" 
                            src={thumbnail}
                            alt={title}
                            style={{
                                width: '280px',
                                height: '420px',
                                objectFit: 'cover',
                            }}
                        />
                        : <Box 
                            sx={{ 
                                width: '280px', 
                                height: '420px', 
                                bgcolor: 'background.default',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Book sx={{ fontSize: 64, color: 'text.secondary' }} />
                        </Box>
                    }
                </div>
                <div className="flex flex-col flex-1 min-w-0 overflow-y-scroll">
                    <div className="mb-3 shrink-0">
                        {!clubId 
                            ? inLibrary
                             ? <Button onClick={() => setOpen(true)} variant="contained" color="warning">Remove From Library</Button>
                             : user ? <Button onClick={addBookToLibrary} variant="contained" color="primary">Add to Library</Button>
                                    : null
                            : <Button onClick={addClubBook} variant="contained" color="primary">Set as Current Book</Button>
                        }
                    </div>
                    <Box 
                        sx={{ 
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            p: 3,
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <div className="mb-3">
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    mb: 1, 
                                    fontWeight: 700,
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography 
                                variant="subtitle1" 
                                color="text.secondary" 
                                sx={{ 
                                    fontStyle: 'italic',
                                }}
                            >
                                {author}
                            </Typography>
                        </div>
                        <TextCollapse >
                            <Box
                                className="reading-text"
                                sx={{
                                    pr: 1,
                                    '& p': { mb: 2 },
                                }}
                            >
                                <Typography
                                    component="div"
                                    variant="body1"
                                    color="text.primary"
                                    dangerouslySetInnerHTML={{
                                        __html: description
                                    }}
                                />
                            </Box>
                        </TextCollapse>
                    </Box>
                </div>
            </div>
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
        </div>
    )
}