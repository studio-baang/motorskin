export function filterAddonDataFn({ data, idArr }) {
	const numArray = idArr.map(Number);
	return data.filter((item) => numArray.includes(item.id));
}
