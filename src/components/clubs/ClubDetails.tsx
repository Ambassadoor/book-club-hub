import { Box, Button, ButtonGroup, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { JoinClubButton } from "./JoinClubButton"
import { LeaveClubButton } from "./LeaveClubButton"
import { ToggleField } from "../profile/ToggleField"
import { BookSearchResult } from "../library/BookSearchResult"
import type { ClubBook } from "./Club"
import { Book } from "@mui/icons-material"

type ClubDetailsProps = {
    user?: number | null
}

type ClubInfo = {
    name: string,
    description: string,
    ownerId: string,
    "created_at": string,
    id: number,
    clubBooks: ClubBook[]
}

// Displays a club's details
export const ClubDetails = ({user}: ClubDetailsProps) => {
    const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null)
    const [currentBook, setCurrentBook] = useState<UserBook | null>(null)
    const [userRole, setUserRole] = useState<string>("guest")
    const [editing, setEditing] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const {clubId} = useParams()
    const navigate = useNavigate()

    //TODO: Change workflow to: Get clubMember on load, null reponse: guest, otherwise isAdmin dictates
    // Then we can pass the clubMember data to join/leave buttons, reducing fetch calls

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClubInfo(prev => prev ? {
            ...prev, [e.target.name]: e.target.value
        }: prev)
    }

    const handleSubmit = async () => {
        const response = await fetch(`http://localhost:8088/clubs/${clubId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(clubInfo)
        }).then(res => res.json())
        setEditing(false)
    }

    const handleEdit = () => {
        setEditing(true)
    }

    const handleCancel = () => {
        setEditing(false)
    }

    const handleChangeBook = () => {
        navigate(`/books/${clubId}/change`)
    }

    const handleDeleteClick = () => {
        setOpen(true)
    }

    const handleCancelDelete = () => {
        setOpen(false)
    }

    const handleDelete = async () => {
        await fetch(`http://localhost:8088/clubs/${clubId}`, {
            method: "DELETE"
        })
        navigate(`/clubs/myClubs/${user}`)
    }

    useEffect(() => {
        if (user && clubId) {
            fetch(`http://localhost:8088/clubMembers?userId=${user}&clubId=${clubId}`).
            then(res => res.json()).
            then(res => {
                if (res.length > 0) {
                    res[0].isAdmin
                    ? setUserRole("admin")
                    : res[0].isActive ? setUserRole("member")
                    : setUserRole("guest")
                } else {
                    setUserRole("guest")
                }
            })
        }
    },[user, clubId])

    useEffect(() => {
        fetch(`http://localhost:8088/clubs/${clubId}?_embed=clubBooks`).
            then(res => res.json()).
                then(setClubInfo).catch(error => console.error(error))
    }, [clubId])

    useEffect(() => {
        if (!clubInfo?.clubBooks) return
        if (clubInfo?.clubBooks?.length > 0) {
            const current = clubInfo.clubBooks.find((book) => book.isCurrent)
            if (current) setCurrentBook(current)
        }
    },[clubInfo])

    return (
        clubInfo &&
        <div className="flex flex-col gap-4 p-4 mt-3 rounded-lg max-w-full overflow-x-hidden">
            <Box 
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                }}
            >
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-wrap gap-2 items-center w-full min-w-0">
                    <div className="flex-1 min-w-0" style={{ minWidth: '250px' }}>
                        <ToggleField 
                            variant="h5" 
                            fullWidth 
                            name="name" 
                            editing={editing} 
                            value={clubInfo.name} 
                            label="Club Name" 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex gap-1 items-center">
                        {userRole !== "guest" && userRole === "admin" ? (
                            <Chip size="small" color="secondary" label="Admin"/>
                        ) : user && (
                            <Chip size="small" color="primary" label="Member"/>
                        )}
                        {userRole === "admin" ? (
                            <Button variant="contained" size="small" hidden={editing} onClick={handleEdit}>Edit Club</Button>
                        ) : userRole === "guest" ? (
                            user && <JoinClubButton userId={user} clubId={Number(clubId)} handleJoin={setUserRole}/>
                        ) : (
                            <LeaveClubButton userId={user} clubId={Number(clubId)} handleLeave={setUserRole}/>
                        )}
                    </div>
                </div>
                <div className="w-full min-w-0">
                    <ToggleField 
                        variant="body1" 
                        fullWidth 
                        multiline 
                        name="description" 
                        editing={editing} 
                        value={clubInfo.description} 
                        label="Description" 
                        onChange={handleChange}
                    />
                </div>
                {editing && (
                    <div className="flex justify-between mt-2 flex-wrap gap-2">
                        <Button variant="outlined" color="error" size="small" onClick={handleDeleteClick}>
                            Delete Club
                        </Button>
                        <div className="flex gap-1">
                            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>Save Changes</Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 w-full min-w-0">
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, flex: 1 }}>
                    <Box 
                        sx={{ 
                            width: { xs: '100%', md: 200 },
                            height: 300,
                            flexShrink: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                        }}
                    >
                        {currentBook?.imageLarge ? (
                            <img 
                                className="rounded-lg shadow-md" 
                                src={currentBook.imageLarge}
                                alt={currentBook.title}
                                style={{
                                    width: '100%',
                                    maxWidth: 200,
                                    height: 'auto',
                                    objectFit: 'contain',
                                }}
                            />
                        ) : (
                            <Box 
                                sx={{ 
                                    width: 200, 
                                    height: 300, 
                                    bgcolor: 'action.selected',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Book sx={{ fontSize: 64, color: 'text.secondary' }} />
                            </Box>
                        )}
                    </Box>

                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {currentBook?.title || 'No Current Book'}
                            </Typography>
                            {currentBook?.author && (
                                <Typography 
                                    variant="subtitle1" 
                                    color="text.secondary" 
                                    sx={{ 
                                        fontStyle: 'italic', 
                                        mb: 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {currentBook.author}
                                </Typography>
                            )}
                            {currentBook?.description && (
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    className="reading-text"
                                    sx={{ 
                                        maxHeight: 120,
                                        overflow: 'auto',
                                        mb: 2,
                                    }}
                                >
                                    {currentBook.description}
                                </Typography>
                            )}
                            {userRole === "admin" && (
                                <Button size="small" variant="contained" onClick={handleChangeBook}>
                                    Change Book
                                </Button>
                            )}
                        </Box>
                    </div>
                </Box>

                <div className="flex flex-col flex-1 lg:flex-none lg:w-[300px] min-w-0">
                    <Box 
                        sx={{
                            width: '100%',
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Previous Reads
                        </Typography>
                        <List sx={{ maxHeight: 400, overflow: 'auto', width: '100%' }} dense>
                        {clubInfo?.clubBooks.filter((book) => !book.isCurrent).length > 0 ? (
                            clubInfo.clubBooks.filter((book) => !book.isCurrent).map(book => (
                                <BookSearchResult key={book.id} book={book}/>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                No previous books yet
                            </Typography>
                        )}
                        </List>
                    </Box>
                </div>
            </div>

            <Box 
                sx={{
                    width: '100%',
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    p: 3,
                    border: 1,
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Next Meeting</Typography>
                <Typography variant="body1" color="text.secondary">Coming Soon</Typography>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Delete Club?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you wish to delete this club? This action cannot be reversed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>
                        Delete Club
                    </Button>
                </DialogActions>
            </Dialog>
            </Box>
        </div>
    )
}