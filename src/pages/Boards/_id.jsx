

import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import {fetchBoardDetailsAPI} from '~/apis/index'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId='6706ee0e63b3f603a4c57e6f'
    fetchBoardDetailsAPI(boardId).then((data) => {
      setBoard(data)
    })
  }, [])
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent board={board}/>
    </Container>
  )
}

export default Board
