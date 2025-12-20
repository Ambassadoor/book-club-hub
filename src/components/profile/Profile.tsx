import { Avatar, Box, Button, IconButton, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { getUser, updateProfile, type User } from "../../services/userServices/userServices"
import { ToggleField } from "./ToggleField"
import { Edit, EditOff } from "@mui/icons-material"

type ProfileProps = {
    user: number | null
}

// A profile info display/edit component. 
export const Profile = ({user}: ProfileProps) => {
    const [userInfo, setUserInfo] = useState<User>()
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        user && 
        getUser(user).then(res => setUserInfo(res))
    }, [user])

    const handleEditClick = () => {
        setEditing((b) => !b)
    }

    const handleEditField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name

        userInfo && 

        setUserInfo({
            ...userInfo, [key]: e.target.value
        })
    }

    const handleSave = () => {
        if (userInfo) {
        const cleanedData = Object.fromEntries(
            Object.entries(userInfo).map(([key, value]) => [
                key, typeof value === "string" ? value.trim() : value
            ])
        )
        user &&
        updateProfile(user, cleanedData as User)
        setEditing(false)
    }
}

    const handleCancel = () => {
        setEditing(false)
        user && 
        getUser(user).then(res => setUserInfo(res))

    }

    return (
        userInfo?.id && 
        <Box 
            sx={{
                display: 'flex',
                height: "fit-content",
                flexDirection: 'column',
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                m: 3,
                mx: { xs: 2, md: 10 },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" color="text.primary">
                        {userInfo?.userName ? `${userInfo.userName}'s Profile` : "My Profile"}
                    </Typography>
                    <IconButton size="small" onClick={handleEditClick}>
                        {!editing ? <Edit color="primary"/> : <EditOff color="secondary"/>}
                    </IconButton>
                </Box>
                <Avatar 
                    sx={{ ml: 'auto', width: 56, height: 56 }} 
                    alt={`${userInfo.firstName} ${userInfo.lastName}`} 
                    src={userInfo.picture ? userInfo.picture : ""}
                >
                    {userInfo.firstName.slice(0,1)}{userInfo.lastName.slice(0,1)}
                </Avatar>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: editing ? 3 : 0 }}>
                <ToggleField name="firstName" editing={editing} label="First Name" value={userInfo.firstName} onChange={handleEditField}/>
                <ToggleField name="lastName" editing={editing} label="Last Name" value={userInfo.lastName} onChange={handleEditField}/>
                <ToggleField name="tagline" editing={editing} label="Tagline" value={userInfo.tagline} onChange={handleEditField}/>
                <ToggleField name="userName" editing={editing} label="Username" value={userInfo.userName} onChange={handleEditField}/>
                {/* Only users who create account with BCH will have password, and cannot change email since it's associated with
                google account. May implement secondary email address in future"
                */}
                
                {/* TODO: Either add new email field to database to check google account logins or add secondary email */}
                {userInfo.method === "bch" &&
                <>
                    <ToggleField name="password" editing={editing} label="Password" value={editing ? userInfo.password : `••••••••`} type="password" onChange={handleEditField}/>
                    <ToggleField name="email" editing={editing} label="Email" value={userInfo.email} onChange={handleEditField}/>
                </>
                }
            </Box>
            {editing && 
                <Box sx={{ display: 'flex', ml: 'auto', gap: 1 }}>
                    <Button color="secondary" size="small" onClick={handleCancel}>Cancel</Button>
                    <Button variant="contained" color="primary" size="small" onClick={handleSave}>Save</Button>
                </Box>}
        </Box>
        
    )
}