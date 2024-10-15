import {useEffect, useState, useCallback, useRef} from 'react'
import { Box} from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext,
  //PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor, useSensors,
  DragOverlay, defaultDropAnimationSideEffects, closestCorners, pointerWithin, rectIntersection, getFirstCollision, 
  closestCenter} from '@dnd-kit/core'
 import {MouseSensor, TouchSensor  } from '~/customLibraries/DndKitSensors'
import {arrayMove} from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty} from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formatters'
const ACTIVE_DRAG__ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG__ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG__ITEM_TYPE_CARD'
}

function BoardContent({ board, createNewColumn ,createNewCard, moveColumn}) {
  //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })


  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  const lastOverId = useRef(null)

  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumns)}, [board])
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  // Update state of orderedColumns when dragging and dropping card between columns
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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
        // If there is no card in the active column, add a placeholder card
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards=[generatePlaceHolderCard(nextActiveColumn)]
        }

        //Remove the cardOrderIds in the active column
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id )
      }
      if (nextOverColumn ) {
        // Check to see if the card is already in the over column, if so, remove it
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Update the columnId of the active dragging card
        const updatedActiveDraggingCardData = { ...activeDraggingCardData, columnId: nextOverColumn._id }
        // Add the card to the over column by the new index
        nextOverColumn.cards=nextOverColumn.cards.toSpliced(newCardIndex, 0, updatedActiveDraggingCardData)
        // If there is a placeholder card in the over column, remove it
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        //Update the cardOrderIds in the over column
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id )
      }
      return nextColumns
    })
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
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
        //This part handle the case when the card is dragged between columns
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        //This part handle the case when the card is dragged within the same column
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
        moveColumn(dndOrderedColumns)
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
  const collisionDetectionStrategy = useCallback((args)=>{
    if (activeDragItemType===ACTIVE_DRAG__ITEM_TYPE.COLUMN) {
      return closestCorners({...args})
    }
    const pointerIntersections = pointerWithin(args)
    if(!pointerIntersections?.length) return 
    // const intersections = pointerIntersections?.length >0
    //   ? pointerIntersections : rectIntersection(args)
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({ ...args,
          droppableContainers: args.droppableContainers.filter(container => container.id !== overId && checkColumn.cardOrderIds.includes(container.id))
        })[0]?.id
      }
      lastOverId.current = overId
      return [{id:overId}]
    }
    return lastOverId.current ? [{id:lastOverId.current}] : []
  },[activeDragItemType,orderedColumns])
  return (
    <DndContext 
      sensors={sensors}
      //collisionDetection={closestCorners} Encountered an error when using this option which the card would be flickering when dragging between columns
      collisionDetection={collisionDetectionStrategy}
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
        <ListColumns columns={orderedColumns} createNewColumn={createNewColumn} createNewCard={createNewCard} />
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
