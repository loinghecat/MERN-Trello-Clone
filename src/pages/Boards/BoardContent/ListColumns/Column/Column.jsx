import React from 'react'
import { Box, Typography, Button, List } from '@mui/material'
import { Tooltip } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddCardIcon from '@mui/icons-material/AddCard';
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListCards from './ListCards/ListCards'

import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import theme from '~/theme'


function Column() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box sx={{
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
        }}>Column Title</Typography>
        <Box>
          <Tooltip title="More options">
          <ExpandMoreIcon
            sx={{ color:'text.primary',cursor:'pointer' }}
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
            MenuListProps={{
              'aria-labelledby': 'basic-column-dropdown'
            }}
          >
            <MenuItem>
              <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
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
            <MenuItem>
              <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Remove this column</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
     <ListCards />
      <Box sx={{
        height: (theme) => theme.trello.columnFooterHeight,
        p:2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Button startIcon={<AddCardIcon/>}>Add new card</Button>
        <Tooltip title='Drag to move'><DragHandleIcon sx={{cursor:'pointer'}}/></Tooltip>
      </Box>
    </Box>
  )
}

export default Column