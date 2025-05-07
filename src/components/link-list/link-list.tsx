import { HoverIcon } from '@/icons'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import styles from './link-list.module.css'

export interface LinkItem {
  id: string
  title: string
  url: string
  is_visible?: boolean
  image_url?: string | null
  imageUrl?: string | null
}

const reorder = (
  list: LinkItem[],
  startIndex: number,
  endIndex: number
): LinkItem[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

interface LinksListProps {
  items: LinkItem[]
  onItemClick?: (item: LinkItem) => void
  onReorder?: (items: LinkItem[]) => void
}

export const LinksList: React.FC<LinksListProps> = ({
  items,
  onItemClick,
  onReorder,
}) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const newLinks = reorder(
      items,
      result.source.index,
      result.destination.index
    )

    if (onReorder) {
      onReorder(newLinks)
    }
  }

  const handleItemClick = (item: LinkItem) => {
    if (onItemClick) {
      onItemClick(item)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="links-list">
        {(provided, snapshot) => (
          <ul
            className={styles.linksList}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`${styles.linkItem} ${snapshot.isDragging ? styles.dragging : ''}`}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className={styles.dragHandle}
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      <HoverIcon className={styles.dragIcon} />
                    </div>

                    <div
                      className={styles.linkContent}
                      onClick={() => handleItemClick(item)}
                      onKeyDown={() => handleItemClick(item)}
                    >
                      {(item.imageUrl || item.image_url) && (
                        <div className={styles.imageContainer}>
                          <img
                            src={item.imageUrl || item.image_url || ''}
                            alt=""
                            className={styles.linkImage}
                          />
                        </div>
                      )}
                      <div className={styles.linkInfo}>
                        <p className={styles.linkTitle}>{item.title}</p>
                        <p className={styles.linkUrl}>{item.url}</p>
                      </div>
                    </div>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}
