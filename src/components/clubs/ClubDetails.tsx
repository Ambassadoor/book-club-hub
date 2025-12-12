import { Box, Button, ButtonGroup, Chip, List, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { JoinClubButton } from "./JoinClubButton"
import { LeaveClubButton } from "./LeaveClubButton"
import { ToggleField } from "../profile/ToggleField"
import { BookSearchResult } from "../library/BookSearchResult"

type ClubDetailsProps = {
    user?: number
}

export const ClubDetails = ({user}: ClubDetailsProps) => {
    const [clubInfo, setClubInfo] = useState(null)
    const [currentBook, setCurrentBook] = useState(null)
    const [userRole, setUserRole] = useState("guest")
    const [editing, setEditing] = useState(false)
    const {clubId} = useParams()

    //TODO: Change workflow to: Get clubMember on load, null reponse: guest, otherwise isAdmin dictates
    // Then we can pass the clubMember data to join/leave buttons, reducing fetch calls

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClubInfo(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
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
        if (clubInfo?.clubBooks.length > 0) {
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
                                : <Chip size="small" color="primary" label="Member"/>
                            }
                        </Box>
                        <Box className="self-center">
                            {
                            userRole === "admin"
                            ? <Button variant="contained" size="small" hidden={editing} onClick={handleEdit}>Edit Club</Button>
                            : userRole ==="guest"
                            ? <JoinClubButton userId={user} clubId={clubId} handleJoin={setUserRole}/>
                            : <LeaveClubButton userId={user} clubId={clubId} handleLeave={setUserRole}/>
                            }
                        </Box>
                    </Box>
                </Box>
                <ToggleField variant="body1" fullWidth multiline name="description" editing={editing} value={clubInfo.description} label="Description" onChange={handleChange}/>
                {editing &&
                <ButtonGroup className="ml-auto">
                    <Button color="warning" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Confirm</Button>
                </ButtonGroup>}
            </Box>
            <Box className="flex flex-row flex-wrap">
                <Box className="flex flex-row shrink">
                    <Box className="flex min-w-[33%] max-w-[50%] grow w-full">
                        <img className="rounded" height="100%" width="100%" src={currentBook?.imageLarge}/>
                    </Box>
                    <Box className="flex max-w-[50%] min-w-[33%%] shrink">
                        <Box className="flex flex-col">
                            <Typography variant="h6">{currentBook?.title}</Typography>
                            <Typography variant="body2">{currentBook?.author}</Typography>
                            <Typography variant="body1">{currentBook?.description}</Typography>
                            <Box className="ml-auto">
                                <Button size="small"variant="contained">Change Book</Button>
                            </Box>
                        </Box>
                        <Box>
                            <List>
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
        </Box>
    )
}