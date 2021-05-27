import {Position, Size} from '../interfaces';

// начальные кастомные настройки для зума
export interface Options {
    /** масштаб контента */
    scale: number;
    /** минимальный зум */
    min: number;
    /** максимальный зум */
    max: number;
    /** коэффициент изменения зума для контролов */
    factor: number;
    /** коэффициент изменения зума для прокрутки колеса мыши или тачпада */
    factorWheel: number;
    /** процент от размеров zoomContent, который всегда буден виден даже при сдвиге за границы области просмотра */
    shiftPercentage: number;
    /** длительность анимации для zoom */
    transitionDuration: number;
    /** длительность анимации для перетаскивания */
    dragTransitionDuration: number;
}

export interface ZoomState {
    /** текущий сдвиг контента */
    translate: Position;
    /** текущий зум */
    scale: number;
    /** сдвиг контента на момент начала перетаскивания */
    translateOrigin: Position;
    /** координаты мыши на момент начала перетаскивания */
    mouseOrigin: Position;
    /** флаг перетаскивания */
    isDragging: boolean;
    /** настройки для zoom */
    options: Options;
}

export enum ActionType {
    /** начало перетаскивания */
    DragStart = 'DragStart',
    /** перетаскивание */
    Drag = 'Drag',
    /** конец перетаскивания */
    DragEnd = 'DragEnd',
    /** зум */
    Zoom = 'Zoom',
    /** установка значений на начальные */
    SetToInitialValues = 'SetToInitialValues',
    /** установка настроек */
    SetZoomOptions = 'SetZoomOptions',
}

export interface DragStartAction {
    /** тип действия */
    type: ActionType.DragStart;
    /** клиентские координаты мыши */
    mouse: Position;
}

export interface DragAction {
    /** тип действия */
    type: ActionType.Drag;
    /** клиентские координаты мыши */
    mouse: Position;
    /** размеры компонента */
    zoomSize: Size;
    /** размеры контента */
    contentSize: Size;
}

export interface DragEndAction {
    /** тип действия */
    type: ActionType.DragEnd;
}

export interface ZoomAction {
    type: ActionType.Zoom;
    /** множитель зума */
    factor: number;
    /** клиентские координаты мыши */
    mouse: Position;
}

export interface SetToInitialValuesAction {
    /** тип действия */
    type: ActionType.SetToInitialValues;
    /** размеры компонента */
    zoomSize: Size;
    /** размеры контента */
    contentSize: Size;
}

export interface SetZoomOptionsAction {
    /** тип действия */
    type: ActionType.SetZoomOptions;
    /** набор настроек для zoom */
    options: Options;
}

export type ZoomActionType =
    | DragStartAction
    | DragAction
    | DragEndAction
    | ZoomAction
    | SetToInitialValuesAction
    | SetZoomOptionsAction;
