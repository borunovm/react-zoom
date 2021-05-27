import React, {FC, useCallback, useEffect, useReducer, useRef} from 'react';

import {INITIAL_REDUCER} from './constants';
import {useStyles} from './index.style';
import {ZoomProps} from './interfaces';
import {reducer} from './reducer';
import {ActionType} from './reducer/interfaces';
import {getSize, setZoomContentStyles} from './utils';

/**
 * Компонент, позволяющий двигать мышью и зумить колесом свой контент
 */
const Zoom: FC<ZoomProps> = (props) => {
    const classes = useStyles();
    const {className = '', zoomOptions, renderControls, children} = props;

    const [{isDragging, translate, scale, options}, dispatch] = useReducer(
        reducer,
        INITIAL_REDUCER,
    );

    // реф для определения размеров вьюпорта
    const refZoom = useRef<HTMLDivElement>(null);
    // реф для определения размеров контента
    const refZoomContent = useRef<HTMLDivElement>(null);

    // нажатие мыши и захват контента
    const handleMouseDown = useCallback(
        ({clientX, clientY}: React.MouseEvent) =>
            dispatch({
                type: ActionType.DragStart,
                mouse: {x: clientX, y: clientY},
            }),
        [dispatch],
    );

    // отпускание нажатия мыши
    const handleMouseUp = useCallback(
        () => dispatch({type: ActionType.DragEnd}),
        [dispatch],
    );

    // движение мыши
    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            if (!isDragging || !refZoom.current || !refZoomContent.current) {
                return;
            }

            event.preventDefault();

            const mouse = {x: event.clientX, y: event.clientY};
            const zoomSize = getSize(refZoom);
            const contentSize = getSize(refZoomContent);

            dispatch({type: ActionType.Drag, mouse, zoomSize, contentSize});
        },
        [isDragging, dispatch],
    );

    // прокрутка колесом мыши
    const handleWheel = useCallback(
        (event: WheelEvent) => {
            event.preventDefault();

            if (!refZoom.current || event.deltaY === 0) {
                return;
            }

            // прокрутка (увеличение)
            let factor = options.factorWheel;
            // прокрутка (уменьшение)
            if (event.deltaY > 0) {
                factor = -factor;
            }

            const rect = refZoom.current.getBoundingClientRect();
            const mouse = {
                x: event.clientX - rect.x,
                y: event.clientY - rect.y,
            };

            dispatch({type: ActionType.Zoom, factor, mouse});
        },
        [options.factorWheel, dispatch],
    );

    // увеличение по клику на кнопку
    const zoomIn = useCallback(() => {
        if (!refZoom.current || !refZoomContent.current) return;

        const factor = options.factor;
        const zoomRect = refZoom.current.getBoundingClientRect();
        const zoomContentRect = refZoomContent.current.getBoundingClientRect();
        // Высота header, котора не должна учитываться в системе координат для зума
        const offsetTop = zoomRect.top;
        const mouse = {
            x: zoomContentRect.x + zoomContentRect.width / 2,
            y: zoomContentRect.y + zoomContentRect.height / 2 - offsetTop,
        };

        dispatch({type: ActionType.Zoom, factor, mouse});
    }, [options.factor]);

    // уменьшение по клику на кнопку
    const zoomOut = useCallback(() => {
        if (!refZoom.current || !refZoomContent.current) return;

        const factor = -options.factor;
        const zoomRect = refZoom.current.getBoundingClientRect();
        const zoomContentRect = refZoomContent.current.getBoundingClientRect();
        // Высота header, котора не должна учитываться в системе координат для зума
        const offsetTop = zoomRect.top;
        const mouse = {
            x: zoomContentRect.x + zoomContentRect.width / 2,
            y: zoomContentRect.y + zoomContentRect.height / 2 - offsetTop,
        };

        dispatch({type: ActionType.Zoom, factor, mouse});
    }, [options.factor]);

    // функция для позиционирования контента по центру
    const setToInitialValues = useCallback(() => {
        if (refZoom.current && refZoomContent.current) {
            const zoomSize = getSize(refZoom);
            const contentSize = getSize(refZoomContent);

            dispatch({
                type: ActionType.SetToInitialValues,
                zoomSize,
                contentSize,
            });
        }
    }, []);

    // рассчитываем начальные значения настроек
    const setInitialOptions = useCallback(() => {
        if (refZoom.current && refZoomContent.current) {
            const zoomRect = refZoom.current.getBoundingClientRect();
            const zoomContentRect = refZoomContent.current.getBoundingClientRect();

            dispatch({
                type: ActionType.SetZoomOptions,
                options: {
                    ...INITIAL_REDUCER.options,
                    ...zoomOptions,
                    scale:
                        zoomOptions?.scale ??
                        zoomRect.height / zoomContentRect.height,
                },
            });

            // вызываем установку начальных параметров
            setToInitialValues();
        }
    }, [zoomOptions, setToInitialValues]);

    // центруем и зумируем контент на маунте
    useEffect(() => {
        setInitialOptions();
    }, [setInitialOptions]);

    // глобальные обработчики чтобы ловить драг снаружи области
    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);

        // обработчики событий wheel имеют passive: true по-умолчанию, что помешает
        // вызвать preventDefault
        const zoomElement = refZoom.current;
        if (zoomElement) {
            zoomElement.addEventListener('wheel', handleWheel, {
                passive: false,
            });
        }

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);

            if (zoomElement) {
                zoomElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, [handleMouseUp, handleMouseMove, handleWheel]);

    return (
        <div
            className={`${classes.zoom} ${className}`}
            ref={refZoom}
            onMouseDown={handleMouseDown}
            style={{cursor: isDragging ? 'grabbing' : ''}}
        >
            <div
                className={classes.zoomContent}
                ref={refZoomContent}
                style={setZoomContentStyles(
                    translate,
                    scale,
                    isDragging,
                    options,
                )}
            >
                {children({scale})}
            </div>

            {renderControls &&
                renderControls({setToInitialValues, zoomIn, zoomOut})}
        </div>
    );
};

export default Zoom;
