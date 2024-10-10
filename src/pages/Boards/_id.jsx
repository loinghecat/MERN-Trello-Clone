

import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import {fetchBoardDetailsAPI} from '~/apis/index'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId='670746f06b9047ec832fc704'
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
