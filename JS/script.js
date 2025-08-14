// using the dnd 5e API https://www.dnd5eapi.co/api/2014/
// spell name, spell lvl
// casting time, range, components, duration
// description
// at higher levels
const baseUrl = 'https://www.dnd5eapi.co';

const getAllSpells = async () => {
	try {
		const spellIndexes = await fetch(
			baseUrl + '/api/2014/classes/druid/spells'
		).then((response) => response.json());

		const first30 = spellIndexes.results.slice(30, 60);

		return Promise.all(
			first30.map((spell) =>
				fetch(baseUrl + spell.url).then((response) => response.json())
			)
		);
	} catch (err) {
		console.error('Error fetching spells: ', err);
		return [];
	}
};

getAllSpells().then((data) => console.log(data));

/* const renderCollection(spells) {
	
} */
// console.log(spellCards());
