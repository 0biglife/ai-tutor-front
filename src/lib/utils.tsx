// 날짜 포맷팅
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

// 채팅 횟수 포맷팅
export function formatUsageCount(count: number | null): string {
  return count === null ? "무제한" : `${count}회`;
}
