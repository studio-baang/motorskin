export function filterTaxonomyData(originData) {
	const filterData = originData.map((item) => {
		return {
			id: item.id,
			title: item.name,
			description: item.description == "" ? null : item.description,
			price: item.acf.price ?? 0,
		};
	});
	return filterData;
}
