import clamp from 'lodash/clamp';

import {ActionType, ZoomActionType, ZoomState} from './interfaces';

/**
 * Редюсер событий для зума
 *
 * @param state
 * @param action
 */
export const reducer = (
    state: ZoomState,
    action: ZoomActionType,
): ZoomState => {
    switch (action.type) {
        case ActionType.DragStart:
            return {
                ...state,
                isDragging: true,
                // сохраняем текущие координаты мыши
                mouseOrigin: {
                    x: action.mouse.x,
                    y: action.mouse.y,
                },
                // сохраняем текущий сдвиг контента
                translateOrigin: {
                    ...state.translate,
                },
            };
        case ActionType.Drag:
            // левая и правая границы
            const borderLeftRightShift =
                ((action.contentSize.width * state.scale) / 100) *
                state.options.shiftPercentage;
            // верхняя и нижняя границы
            const borderTopBottomShift =
                ((action.contentSize.height * state.scale) / 100) *
                state.options.shiftPercentage;

            return {
                ...state,
                // сдвигаем на дельту передвижения мыши
                translate: {
                    x: clamp(
                        state.translateOrigin.x -
                            state.mouseOrigin.x +
                            action.mouse.x,
                        -action.contentSize.width * state.scale +
                            borderLeftRightShift,
                        action.zoomSize.width - borderLeftRightShift,
                    ),
                    y: clamp(
                        state.translateOrigin.y -
                            state.mouseOrigin.y +
                            action.mouse.y,
                        -action.contentSize.height * state.scale +
                            borderTopBottomShift,
                        action.zoomSize.height - borderTopBottomShift,
                    ),
                },
            };
        case ActionType.DragEnd:
            return {
                ...state,
                isDragging: false,
            };
        case ActionType.Zoom: {
            const {factor, mouse} = action;

            // новое значение зума
            const scale = clamp(
                state.scale + factor,
                state.options.min,
                state.options.max,
            );

            // позиция мыши в координатах контента
            const posContent = {
                x: (mouse.x - state.translate.x) / state.scale,
                y: (mouse.y - state.translate.y) / state.scale,
            };

            // прирост размеров контента
            const delta = {
                x: (scale - state.scale) * posContent.x,
                y: (scale - state.scale) * posContent.y,
            };

            // сдвигаем немного контент чтобы зум происходил по координатам мыши
            // таким образом та точка контента, которая находилась под мышью до зума,
            // останется под мышью и после
            const translate = {
                x: state.translate.x - delta.x,
                y: state.translate.y - delta.y,
            };

            return {
                ...state,
                scale,
                translate,
            };
        }
        case ActionType.SetToInitialValues:
            const scale = clamp(
                state.options.scale,
                state.options.min,
                state.options.max,
            );

            return {
                ...state,
                scale,
                translate: {
                    x:
                        (action.zoomSize.width -
                            action.contentSize.width * scale) /
                        2,
                    y:
                        (action.zoomSize.height -
                            action.contentSize.height * scale) /
                        2,
                },
            };
        case ActionType.SetZoomOptions:
            return {
                ...state,
                options: {
                    ...state.options,
                    ...action.options,
                },
            };
        default:
            return state;
    }
};
