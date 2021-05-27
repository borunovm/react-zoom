import React from 'react';

import {Position, Size, ZoomContentStyles} from './interfaces';
import {Options} from './reducer/interfaces';

// функция для вычисления размеров элемента
export const getSize = (ref: React.RefObject<HTMLDivElement>): Size => {
    if (!ref.current) {
        return {width: 0, height: 0};
    }

    return {
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
    };
};

// функция для вычисления правильного стиля transform и cursor для zoomContent
export const setZoomContentStyles = (
    translate: Position,
    scale: number,
    isDragging: boolean,
    options: Options,
): ZoomContentStyles => ({
    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
    transition: !isDragging
        ? `${options.transitionDuration}s linear`
        : `${options.dragTransitionDuration}s linear`,
    willChange: isDragging ? 'transform' : 'auto',
});
