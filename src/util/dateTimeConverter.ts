const timeFormat = new Intl.DateTimeFormat("sk-SK", {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
})

export function convertDateTime(isoDateTime: string) {
	return timeFormat.format(new Date(isoDateTime));
}