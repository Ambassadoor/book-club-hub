import { Box, Button, ButtonGroup, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { JoinClubButton } from "./JoinClubButton"
import { LeaveClubButton } from "./LeaveClubButton"
import { ToggleField } from "../profile/ToggleField"
import { BookSearchResult } from "../library/BookSearchResult"
import type { ClubBook } from "./Club"

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
        navigate("/clubs")
    }

    useEffect(() => {
        if (user && clubId) {
            fetch(`http://localhost:8088/clubMembers?userId=${user}&clubId=${clubId}`).
            then(res => res.json()).
            then(res => {
                if (res.length > 0) {
                    res[0].isAdmin
                    ? setUserRole("admin")
                    : setUserRole("member")
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
        <Box className="flex flex-col gap-7 bg-neutral-50 rounded p-5">
            <Box className="flex flex-col">
                <Box className="flex">
                    <ToggleField className="self-center" variant="h5" fullWidth name="name" editing={editing} value={clubInfo.name} label="Club Name" onChange={handleChange}/>
                    <Box className="flex gap-2 pl-5">
                        <Box className="self-center">
                            {
                            userRole !== "guest"
                            && userRole === "admin"
                                ? <Chip size="small" color="secondary" label="Admin"/>
                                : user && <Chip size="small" color="primary" label="Member"/>
                            }
                        </Box>
                        <Box className="self-center">
                            {
                            userRole === "admin"
                            ? <Button variant="contained" size="small" hidden={editing} onClick={handleEdit}>Edit Club</Button>
                            : userRole ==="guest"
                            ? user &&<JoinClubButton userId={user} clubId={Number(clubId)} handleJoin={setUserRole}/>
                            : <LeaveClubButton userId={user} clubId={Number(clubId)} handleLeave={setUserRole}/>
                            }
                        </Box>
                    </Box>
                </Box>
                <ToggleField variant="body1" fullWidth multiline name="description" editing={editing} value={clubInfo.description} label="Description" onChange={handleChange}/>
                {editing &&

                <Box className="flex">
                    <Button variant="contained" color="warning" size="small" onClick={handleDeleteClick}>Delete Club</Button>
                    <ButtonGroup className="ml-auto">
                        <Button color="warning" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">Confirm</Button>
                    </ButtonGroup>
                </Box>
                }
            </Box>
            <Box className="flex flex-row flex-wrap">
                <Box className="flex flex-row shrink gap-5">
                    <Box className="flex min-w-[33%] max-w-[50%] grow w-full">
                        <img className="rounded" height="100%" width="100%" src={currentBook?.imageLarge}/>
                    </Box>
                    <Box className="flex flex-col max-w-[50%] min-w-[33%%] shrink">
                        <Box className="flex flex-col">
                            <Typography variant="h6">{currentBook?.title}</Typography>
                            <Typography variant="body2">{currentBook?.author}</Typography>
                            <Typography variant="body1">{currentBook?.description}</Typography>
                            <Box className="ml-auto">
                                {userRole === "admin" && <Button size="small"variant="contained" onClick={handleChangeBook}>Change Book</Button>}
                            </Box>
                        </Box>
                        <Box className="flex justify-center flex-col rounded max-w-fit bg-accent p-2">
                            <Typography variant="h6">Previous Reads</Typography>
                            <List className="flex flex-col max-w-fit">
                                {clubInfo?.clubBooks.filter((book) => 
                                    !book.isCurrent
                                ).map(book => (
                                    <BookSearchResult key={book.id} book={book}/>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </Box>
                <Box className="flex grow min-w-[33%]">
                    <Typography>Next Meeting</Typography>
                    <Typography>Coming Soon</Typography>
                </Box>
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Delete Club?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you wish to delete this club? This action cannot be reversed.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleCancelDelete}>Cancel</Button>
                    <Button color="warning" onClick={handleDelete}>DELETE CLUB</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}