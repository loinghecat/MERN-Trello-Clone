import { Box } from '@mui/material'

function BoardContent() {
  return (
    <Box sx={{
      backgroundColor:'primary.main',
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
