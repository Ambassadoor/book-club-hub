import { Box, Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


type CreateClubFormProps = {
    user: number | null
}

// A form for club creation
export const CreateClubForm = ({user}: CreateClubFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    })

    const navigate = useNavigate()


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
    }

    const handleCancel = () => {
        setFormData(prev => ({
            ...prev, name: "", description: ""
        }))
        navigate(`/clubs/myClubs/${user}`)
    }

    const handleSubmit = async () => {
        const clubResponse = await fetch("http://localhost:8088/clubs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(
                {...formData, ownerId: user, "created_at": new Date()}
            )
        }).then(res => res.json()).catch(error => console.error(error))
        await fetch("http://localhost:8088/clubMembers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    userId: user,
                    clubId: clubResponse.id,
                    isAdmin: true,
                    "created_at": Date.now(),
                    isActive: true,
                }
            )
        }).then(res => res.json()).catch(error => console.error(error))
        navigate(`/clubs/${clubResponse.id}`)
    }
    return (
        user &&
        <div className="flex flex-col gap-3 max-w-[600px] mx-auto mt-4 p-4 rounded-lg">
            <Box 
                sx={{
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                }}
            >
                <div className="flex justify-center mb-3">
                    <Typography variant="h4" color="text.primary">Create a New Club</Typography>
                </div>
                <div className="flex flex-col gap-3">
                <TextField 
                    name="name"
                    value={formData.name}
                    fullWidth
                    label="Club Name"
                    variant="outlined"
                    required
                    onChange={handleChange}
                    placeholder="Enter your club name"
                />
                <TextField 
                    name="description"
                    value={formData.description}
                    multiline 
                    minRows={4} 
                    fullWidth 
                    label="Club Description" 
                    variant="outlined"
                    onChange={handleChange}
                    placeholder="Describe your club's purpose and what you'll be reading..."
                />
                <div className="flex justify-end gap-1">
                    <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
                    <Button 
                        disabled={!(formData.name.trim().length > 0)} 
                        color="primary" 
                        variant="contained" 
                        onClick={handleSubmit}
                    >
                        Create Club
                    </Button>
                </div>
            </div>
            </Box>
        </div>
    )
}