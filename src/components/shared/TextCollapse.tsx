import { Box, Button, Collapse } from "@mui/material"
import { useLayoutEffect, useRef, useState, type ReactNode } from "react"

type TextCollapseProps = {
    children: ReactNode;
    collapsedSize?: number;
}

export const TextCollapse = ({children, collapsedSize = 72}: TextCollapseProps) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const [expanded, setExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)

    useLayoutEffect(() => {
        if (!contentRef.current) return

        const observer = new ResizeObserver(() => {
            const { scrollHeight} = contentRef.current!;
            setIsOverflowing(scrollHeight > collapsedSize)
        })

        observer.observe(contentRef.current);
        return () => observer.disconnect();

    }, [children, collapsedSize])

    return (
        <Box>
            <Collapse in={expanded} collapsedSize={collapsedSize}>
                <div ref={contentRef}>
                    {children}
                </div>
            </Collapse>

            {isOverflowing && (
                <div className="flex">
                    <Button
                        className="ml-auto"
                        size="small"
                        onClick={() => setExpanded(prev => !prev)}
                    >
                        {expanded ? "Show Less" : "Read More"}
                    </Button>
                </div>
            )}
        </Box>
    )
}