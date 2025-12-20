    const [options, setOptions] = useState([
        "Example1", "Example2", "Example3", "Example4",
        "Example1", "Example2", "Example3", "Example4",
        "Example1", "Example2", "Example3", "Example4",
    ])
    const [searchTerm, setSearchTerm] = useState("")
    const [focus, setFocus] = useState(false)
    const [open, setOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null);


// <Autocomplete
        //     className="flex h-fit"
        //     fullWidth
        //     size="small"
        //     getOptionLabel={adapter?.getLabel}
        //     open={hideOptions ? false : open}
        //     options={options}
        //     onInputChange={(_,value) => {
        //         setSearchTerm(value)
        //     }}
        //     value={searchTerm}
        //     onChange={(_,value) => adapter.select(value)}
        //     onOpen={() => setTimeout(() => setOpen(true), 300)}
        //     onClose={() => setOpen(false)}
        //     getOptionKey={(option) => option + Date.now()}
        //     renderInput={(params) => (
        //         <TextField
        //             {...params}
        //             className={`
        //                 ml-auto
        //                 transition-all
        //                 duration-300
        //                 ${collapse && !focus && "w-15"}
        //                 `}
        //             inputRef={inputRef}
        //             slotProps={{
        //                 root : {
        //                     className: "self-center"
        //                 },
        //                 input: {
        //                     ...params.InputProps,
        //                     onClick: () => setFocus(true),
        //                     onBlur: () => setFocus(false),
        //                     className: `rounded-full p-[6px]`,
        //                     endAdornment: iconPosition === "end" && (
        //                         <InputAdornment position="start">
        //                             <IconButton
        //                                 disableRipple
        //                                 disableFocusRipple
        //                                 tabIndex={-1}
        //                             >
        //                                 <Search/>
        //                             </IconButton>
        //                         </InputAdornment>
        //                     ),
        //                     startAdornment: iconPosition === "start" && (
        //                         <InputAdornment position="start">
        //                             <IconButton>
        //                                 <Search/>
        //                             </IconButton>
        //                         </InputAdornment>
        //                     )
        //                 }
        //             }}
        //         />
        //     )}
        // />