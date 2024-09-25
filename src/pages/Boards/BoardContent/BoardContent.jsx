import {useEffect,useState} from 'react'
import { Box,  } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor,MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import {
  arrayMove
} from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'
const ACTIVE_DRAG__ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG__ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG__ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })


  const sensors = useSensors(mouseSensor,touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)

  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)}, [board])
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  const handleDragStart = (event) => {
  // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemData(event?.active?.data?.current)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG__ITEM_TYPE.CARD : ACTIVE_DRAG__ITEM_TYPE.COLUMN)
  }
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG__ITEM_TYPE.COLUMN) return
    // console.log('handleDragOver: ', event)
    const { active, over } = event
    if (!active||!over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    if (!activeColumn || !overColumn) return
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        // Find the new card index. Logic is gotten from dndkit github: https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx
        let newCardIndex
        const isBelowOverItem =
                active.rect.current.translated &&
                active.rect.current.translated.top >over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex =overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
        // Using lodash to deep clone the previous columns to process data
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
        if (nextActiveColumn ) {
          //Remove the card in the active column
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          //Remove the cardOrderIds in the active column
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id )
        }
        if (nextOverColumn ) {
          // Check to see if the card is already in the over column, if so, remove it
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Add the card to the over column by the new index
          nextOverColumn.cards=nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          //Update the cardOrderIds in the over column
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id )
        }
        return nextColumns
      })
    }
  }
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    if(activeDragItemType === ACTIVE_DRAG__ITEM_TYPE.CARD) {
      // console.log('Dragging card animation')
      return  
    }
    if (!active||!over) return
    if (active.id!==over.id) {
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns: ',dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ',dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveDragItemData(null)
    setActiveDragItemId(null)
    setActiveDragItemType(null) 
  }
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active:{
          opacity:'0.5'
        }
      }
    })
  }
  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        display: 'flex',
        height: (theme) => theme.trello.boardContentHeight,
        p:'10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          { activeDragItemType === ACTIVE_DRAG__ITEM_TYPE.COLUMN && <Column column ={activeDragItemData}/>}
          { activeDragItemType === ACTIVE_DRAG__ITEM_TYPE.CARD && <Card card ={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
