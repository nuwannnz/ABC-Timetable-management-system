/* eslint-disable import/prefer-default-export */
export const formatLectureId = (id: number) => `${id}`.padStart(6, '0');

export const formatTime = (time: number) => `${time}`.padStart(2, '0');
