import { DragDropContext } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';

const touchBackend = TouchBackend({
  enableTouchEvents: true,
  enableMouseEvents: true,
  enableHoverOutsideTarget: true,
});

export default DragDropContext(touchBackend);
