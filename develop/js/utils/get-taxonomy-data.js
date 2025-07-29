import { requestWpJson } from "./wp-json";

export async function getTaxonomyData(addonName) {
	const originData = await requestWpJson(`/porsche-dealer/wp-json/wp/v2/${addonName}`);
	const data = originData.map((item) => {
		return {
			id: item.id,
			title: item.name,
			description: item.description,
			price: item.acf.price ?? 0,
		};
	});
	return data;
}
