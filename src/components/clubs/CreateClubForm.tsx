import { Box, Button, ButtonGroup, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


type CreateClubFormProps = {
    user: number | null
}

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
        navigate("/clubs")
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
        const memberResponse = await fetch("http://localhost:8088/clubMembers", {
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
        <Box className="flex flex-col gap-5 rounded bg-accent p-5">
            <Box className="flex justify-center">
                <Typography variant="h4" color="white">Create a new Club</Typography>
            </Box>
            <Box className="flex flex-col gap-5">
                <TextField 
                name="name"
                value={formData.name}
                slotProps={
                    {
                        input: {
                            className: "bg-neutral-50 text-black"
                        }
                    }
                } 
                fullWidth
                label="Club Name"
                variant="outlined"
                required
                onChange={handleChange}
                />
                <TextField 
                name="description"
                value={formData.description}
                slotProps={
                    {
                        input: {
                            className: "bg-neutral-50 text-black"
                        }
                    }
                } 
                multiline 
                minRows={3} 
                fullWidth 
                label="Club Description" 
                variant="outlined"
                onChange={handleChange}
                />
            </Box>
            <Box className="flex">
                <ButtonGroup className="ml-auto">
                    <Button color="secondary" onClick={handleCancel}>Cancel</Button>
                    <Button disabled={!(formData.name.trim().length > 0)} color="primary" variant="contained" onClick={handleSubmit}>Submit</Button>
                </ButtonGroup>
            </Box>

        </Box>
    )
}