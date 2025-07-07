export function filterAddonData(originalData, contentData) {
	const numArray = contentData.map(Number);
	return originalData.filter((item) => numArray.includes(item.id));
}
