import { ExpandMore } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"
import { useState } from "react"

export const AccordionList = ({label}) => {
    const [expanded, setExpanded] = useState(true)

    return (
        <Accordion expanded={expanded} onChange={() => setExpanded(prev => !prev)}>
            <AccordionSummary
                expandIcon={<ExpandMore/>}
            >
                <Typography component="span">{label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            
            </AccordionDetails>
        </Accordion>
    )
}