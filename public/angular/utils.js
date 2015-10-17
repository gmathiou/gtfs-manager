function CreateDateFromTime(hour, minutes, seconds) {
	var date = new Date().setHours(hour, minutes, seconds);
	return date;
}