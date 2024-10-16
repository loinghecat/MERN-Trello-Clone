import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Box, Typography, Button, TextField } from '@mui/material'
import { Tooltip } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddCardIcon from '@mui/icons-material/AddCard'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListCards from './ListCards/ListCards'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import CloseIcon from '@mui/icons-material/Close'
import { useConfirm } from 'material-ui-confirm'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


function Column({ column, createNewCard,deleteColumnDetails }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data:{ ...column } })
  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height:'100%',
    opacity: isDragging ? 0.5 : undefined
  }
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = column?.cards
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Card title is required', { position:'bottom-right' })
      return
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    createNewCard(newCardData)
    toggleNewCardForm()
    setNewCardTitle('')
  }
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn =() => {
    confirmDeleteColumn({
      description: 'This action will delete this column and all the cards in it. Are you sure you want to delete this column?',
      title: 'Delete this column',
      buttonOrder: ['confirm', 'cancel']
    }).then(() => {
      deleteColumnDetails(column._id)
    }

    ).catch( () => {})
  }
  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          minWidth:'300px',
          maxWidth:'300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml:2,
          borderRadius: '6px',
          height:'fit-content',
          maxHeight:(theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p:2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6"sx={{
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>{column?.title}</Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color:'text.primary', cursor:'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}/>
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}

              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem sx={{
                '&:hover':{
                  color: 'success.light',
                  '& .add-card-icon': { color: 'success.light' }
                }
              }}
              onClick={toggleNewCardForm}>
                <ListItemIcon><AddCardIcon className='add-card-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover':{
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' }
                  }
                }}>
                <ListItemIcon><DeleteForeverIcon className='delete-forever-icon' fontSize="small" /></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <ListCards cards={orderedCards}/>
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p:2
        }}>
          {!openNewCardForm
            ?
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'space-between'
            }}>
              <Button startIcon={<AddCardIcon/>} onClick={toggleNewCardForm}>Add new card</Button>
              <Tooltip title='Drag to move'><DragHandleIcon sx={{ cursor:'pointer' }}/></Tooltip>
            </Box>
            :
            <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap:1
            }}>
              <TextField
                label="Enter card title..."
                type="text"
                size='small'
                data-no-dnd = "true"
                variant='outlined'
                autoFocus
                value={newCardTitle}
                onChange = {(e) => setNewCardTitle (e.target.value)}
                sx={{
                  '& label':{ color:'text.primary' },
                  '& input':{
                    color: (theme ) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused':{ color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root':{
                    '& fieldset':{
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&:hover fieldset ':{
                      borderColor: (theme) => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset ':{
                      borderColor: (theme) => theme.palette.primary.main
                    }
                  }
                }}/>
              <Box sx={{
                display:'flex',
                alignItems:'center',
                gap:1
              }}>
                <Button
                  onClick ={addNewCard}
                  data-no-dnd = "true"
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid ',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover':{
                      bgColor: (theme) => theme.palette.success.main
                    }
                  }}
                >Add </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{ color:(theme) => theme.palette.warning.light, cursor:'pointer'
                  }}
                  onClick ={toggleNewCardForm}/>
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column