import { Box } from '@mui/material'

function BoardContent() {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      height: (theme) => `calc(100% - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`
    }}>
      Board Content
    </Box>
  )
}

export default BoardContent
