import { HoverIcon } from '@/icons'
import useLinksStore, { type LinkItem } from '@/store/link.store'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import styles from './link-list.module.css'

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
  onItemClick?: (item: LinkItem) => void
}

export const LinksList: React.FC<LinksListProps> = ({ onItemClick }) => {
  const links = useLinksStore(state => state.links)
  const setLinks = useLinksStore(state => state.setLinks)

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const newLinks = reorder(
      links,
      result.source.index,
      result.destination.index
    )
    setLinks(newLinks)
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
            {links.map((item, index) => (
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
                    {/* Área de drag handle com ícone - aqui é onde o hover ocorre */}
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
                      {item.imageUrl && (
                        <div className={styles.imageContainer}>
                          <img
                            src={item.imageUrl}
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
