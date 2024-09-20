import { Box, Tooltip } from '@mui/material'
import {Chip} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const MENU_STYLE = { bgcolor:'transparent',
  color:'white',
  border:'none',
  paddingX:'5px',
  borderRadius:'4px',
  '.MuiSvgIcon-root':{
    color:'white' },
  '&:hover':{
    bgcolor:'primary.50'}}
function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap:2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        paddingX:2,
        gap: 2
      }}>
        <Chip
          sx={MENU_STYLE
          }
          icon={<DashboardIcon />}
          label="Loi Nghe"
          clickable/>
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label="Public/ Private Workspace"
          clickable/>
        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable/>
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable/>
           <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filter"
          clickable/>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Button 
          variant="outlined" 
          sx={{
            color:'white',
            borderColor:'white',
            '&:hover':{
              borderColor:'white'
            }
          }}
          startIcon={<PersonAddIcon
           />}>Invite</Button>
        <AvatarGroup max={3} sx={{
          gap:'10px',
          '& .MuiAvatar-root':{
            width: 34,
            height: 34,
            fontSize:16,
            border:'none',
            color:'white',
            cursor:'pointer',
            '&: first-of-type':{ bgcolor:'#a4b0de'} }
        }}>
          <Tooltip title="Loi Nghe" alt ="Loi Nghe"> 
            <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Loi Nghe" alt ="Loi Nghe"> 
            <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Loi Nghe" alt ="Loi Nghe"> 
            <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Loi Nghe" alt ="Loi Nghe"> 
            <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="Loi Nghe" alt ="Loi Nghe"> 
            <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
