import {useEffect,useState} from 'react'
import { Box,  } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor,MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, closestCorners } from '@dnd-kit/core'
import {
  arrayMove
} from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { clone, cloneDeep, set } from 'lodash'
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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)


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
    // If the active dragging item is a card, set the old column of the card
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG__ITEM_TYPE.COLUMN) return
    // console.log('handleDragOver: ', event)
    const { active, over } = event
    if (!active||!over) return
    // Get data of the active dragging card
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    //Get data of the card being dragged over
    const { id: overCardId } = over
    //Find the column of the active dragging card and the column of the card being dragged over by their cardId
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
    if (!active||!over) return
    // Handle card drag and drop
    if (activeDragItemType === ACTIVE_DRAG__ITEM_TYPE.CARD) {
    // Get data of the active dragging card
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      //Get data of the card being dragged over
      const { id: overCardId } = over
      //Find the column of the active dragging card and the column of the card being dragged over by their cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      if (!activeColumn || !overColumn) return
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
//asda
      }else {
        // This whole process has the same logic as the drag and drop between columns
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(card => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard.cards, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => {
          const nextColumns =cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // Update the cards and cardOrderIds of the target column
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          //Return the newest state of the target column
          return nextColumns
        })
      }
    }
    // Handle column drag and drop
    if (activeDragItemType === ACTIVE_DRAG__ITEM_TYPE.COLUMN) {
      if (active.id!==over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns: ',dndOrderedColumns)
        // console.log('dndOrderedColumnsIds: ',dndOrderedColumnsIds)
        setOrderedColumns(dndOrderedColumns)
      }
    }
    setOldColumnWhenDraggingCard(null)
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
      collisionDetection={closestCorners}
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
