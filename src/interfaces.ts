import React from 'react';

export interface Position {
    /** координата по оси X */
    x: number;
    /** координата по оси Y */
    y: number;
}

export interface Size {
    /** ширина */
    width: number;
    /** высота */
    height: number;
}

interface RenderControlsProps {
    /** колбэк функция для установки значений по умолчанию */
    setToInitialValues: () => void;
    /** колбэк функция для приближения */
    zoomIn: () => void;
    /** колбэк функция для отдаления */
    zoomOut: () => void;
}

interface ChildrenProps {
    /** масштаб */
    scale: number;
}

// начальные кастомные настройки для зума
interface ZoomOptions {
    /** масштаб контента */
    scale?: number;
    /** минимальный зум */
    min?: number;
    /** максимальный зум */
    max?: number;
    /** коэффициент изменения зума для контролов */
    factor?: number;
    /** коэффициент изменения зума для прокрутки колеса мыши или тачпада */
    factorWheel?: number;
    /** процент от размеров zoomContent, который всегда буден виден даже при сдвиге за границы области просмотра */
    shiftPercentage?: number;
    /** длительность анимации для zoom */
    transitionDuration?: number;
    /** длительность анимации для перетаскивания */
    dragTransitionDuration?: number;
}

export interface ZoomProps {
    /** имя класса */
    className?: string;
    /** функция отрисовки контролов для зума */
    renderControls?: (props: RenderControlsProps) => React.ReactNode;
    /** настройки */
    zoomOptions?: ZoomOptions;
    /** children зума, реализовано ввиде функции для передачи пропсов и состояний наружу для потомков */
    children: (props: ChildrenProps) => React.ReactNode;
}

export interface ZoomContentStyles {
    /** css свойство transform */
    transform: string;
    /** css свойство transition */
    transition: string;
    /** css свойство will-change */
    willChange: string;
}
