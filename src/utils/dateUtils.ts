/**
 * 현재 날짜를 MM.DD 형식으로 변환하는 함수
 * @param date - 변환할 Date 객체
 * @returns 형식화된 날짜 문자열 (MM.DD)
 */
export const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };
  
  /**
   * 현재 요일을 반환하는 함수
   * @param date - 변환할 Date 객체
   * @returns 요일 문자열 (예: MON, TUE)
   */
  export const getDayOfWeek = (date: Date): string => {
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return weekdays[date.getDay()];
  };