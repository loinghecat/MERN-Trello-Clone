import ModeSelect from '~/components/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
function AppBar() {
  return (
    <Box  sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingX:2,
      gap:2,
      overflowX: 'auto'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <AppsIcon sx={{color:'primary.main'}}/>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}> <SvgIcon component={TrelloIcon} fontSize='small'  sx={{color:'primary.main'}} inheritViewBox/>
          <Typography variant='span' sx={{color:'primary.main', fontSize:'1.2rem', fontWeight:'bold'}}>Trello</Typography>
        </Box>
        <Box sx={{display:{xs:'none', md:'flex'}, gap:1}}>
          <Workspaces/>
          <Recent/>
          <Starred/>
          <Templates/>
          <Button variant="outlined" startIcon={<LibraryAddIcon/>}>Create</Button></Box>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <TextField id="outlined-search" label="Search..." type="search" size='small' />
        <ModeSelect />
        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot" sx={{cursor:'pointer'}} >
            <NotificationsNoneIcon sx={{color:'primary.main'}}/>
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{cursor:'pointer', color:'primary.main'}} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
