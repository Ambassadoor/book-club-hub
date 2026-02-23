import { Book } from "@mui/icons-material"
import { Avatar, Chip, Divider, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"
import { useLayoutEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

export const ClubSearchResult = ({club, user=null}) => {
    const [imgHeight, setImgHeight] = useState(120)
    const navigate = useNavigate()
    const ref = useRef<HTMLDivElement>(null)


    const activeMembers = club?.club?.clubMembers.filter(m => m.isActive) || club.clubMembers.filter(m => m.isActive)
    const currentRead = club?.club?.clubBooks.filter(b => b.isCurrent)[0] || club.clubBooks.filter(b => b.isCurrent)[0]
    const isAdmin = ("isAdmin" in club) ? club.isAdmin : club.ownerId === user
    const clubId = ("clubId" in club) ? club.clubId : club.id

    console.log(user)

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-us", {year: "numeric", month: "short"})
    }

    // useLayoutEffect(() => {
    //     if (!ref.current) return;
    //     const height = Math.min(ref.current.offsetHeight, 200);
    //     setImgHeight(height)

    // },[club])

    return (
    <>
    <ListItem
        key={club.id}
        disableGutters
        alignItems="flex-start"
        sx={{
            bgcolor: 'background.paper',
            '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main'
            }

        }}
    >
        <ListItemButton 
            onClick={() => navigate(`/clubs/${clubId}`)}
            sx={{
                width: '100%',
                minWidth: 0,
                ":hover": {
                    bgcolor: 'rgba(0, 0, 0, 0)'
                }
            }}
        >
            <div ref={ref} className="flex flex-col justify-between flex-1 min-w-0">
                <ListItemText 
                    primary={
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>{club?.club?.name || club.name}</Typography>
                    } 
                    secondary={(
                        <div className="flex gap-1 flex-wrap mt-1">
                            {isAdmin && <Chip size="small" color="secondary" label="Admin"/>}
                            <Chip sx={{ display: { xs: 'none', sm: 'inline-flex' } }} size="small" color="primary" label={`${activeMembers.length} members`}/>
                            <Chip sx={{ display: { xs: 'none', sm: 'inline-flex' } }} size="small" color="primary" label={`Joined ${formatDate(new Date(club["created_at"]))}`}/>
                        </div>
                    )}
                    slotProps={{
                        secondary: {
                            component: "div"
                        }
                    }}
                />
                <div className="mt-2">
                    {currentRead && (
                        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, whiteSpace: {xs: "nowrap"}, overflow: "hidden", textOverflow: "ellipsis", maxWidth: {xs: 300, md: 400} }}>
                            Currently Reading: <strong>{currentRead?.title}</strong>
                        </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Next Meeting: Coming Soon
                    </Typography>
                </div>
            </div>
            <div className="flex justify-center items-center ml-2">
                {currentRead ?
                    <Avatar 
                        sx={{
                            width: imgHeight * (2/3),
                            height: imgHeight
                        }}
                        variant="rounded"
                        alt={`Cover art for ${currentRead?.title}`}
                        src={currentRead?.imageSmall}
                    /> :
                    <Avatar
                        sx={{
                            width: imgHeight * (2/3),
                            height: imgHeight,
                            bgcolor: 'action.selected',
                        }}
                        variant="rounded"
                    >
                        <Book sx={{ fontSize: 40 }} />
                    </Avatar>
                }
            </div>
        </ListItemButton>
    </ListItem>
    <Divider/>
    </>
    )
}