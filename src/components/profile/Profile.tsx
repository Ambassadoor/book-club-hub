import { Avatar, Box, Button, IconButton, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { getUser, updateProfile, type User } from "../../services/userServices/userServices"
import { ToggleField } from "./ToggleField"
import { Edit } from "@mui/icons-material"

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
        <Box className="flex flex-col justify-center bg-neutral-50 mx-10 rounded-md p-10 m-5">
            <Box className="flex flex-row items-center">
                <Box className="flex flex-nowrap">
                    <Typography variant="h5" className="text-black text-center">{userInfo?.userName ? `${userInfo.userName}'s Profile` : "My Profile"}</Typography>
                    <IconButton size="small" onClick={handleEditClick} hidden={editing}>
                        <Edit color="primary"/>
                    </IconButton>
                </Box>
                <Avatar className="my-5 ml-auto md-mr-auto" alt={`${userInfo.firstName} ${userInfo.lastName}`} src={userInfo.picture ? userInfo.picture : ""}>{userInfo.firstName.slice(0,1)}{userInfo.lastName.slice(0,1)}</Avatar>
            </Box>
            <Box className={`flex flex-col ${editing && "mb-5"}`}>
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
                <Box className="flex ml-auto">
                    <Button className="text-accent mr-3" size="small" onClick={handleCancel}>Cancel</Button>
                    <Button className="bg-primary" variant="contained" size="small" onClick={handleSave}>Save</Button>
                </Box>}
        </Box>
        
    )
}