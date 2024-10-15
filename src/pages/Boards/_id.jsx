

import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { generatePlaceHolderCard } from '~/utils/formatters'
import {fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI} from '~/apis/index'
import { create, isEmpty } from 'lodash'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId='670746f06b9047ec832fc704'
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards=[generatePlaceHolderCard(column)]
          column.cardOrderIds=[generatePlaceHolderCard(column)._id]
        }
      })
      setBoard(board)
    })
  }, [])
  // Call the createNewColumnAPI function from the apis/index.js file and reload the board content
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    createdColumn.cards=[generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds=[generatePlaceHolderCard(createdColumn)._id]

    const newBoard = {...board}
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    const newBoard = {...board}
    const columnToUpdate = newBoard.columns.find(column => column._id === newCardData.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
