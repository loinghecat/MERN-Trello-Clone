import {useEffect,useState} from 'react'
import { Box,  } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor,MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })


  const sensors = useSensors(mouseSensor,touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)}, [board])
  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ',event)
    const { active, over } = event

    if (!over) return
    if (active.id!==over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns: ',dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ',dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        display: 'flex',
        height: (theme) => theme.trello.boardContentHeight,
        p:'10px 0'
      }}>
        <ListColumns columns={orderedColumns} /> 
      </Box>
    </DndContext>
  )
}

export default BoardContent
