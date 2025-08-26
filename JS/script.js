// using the dnd 5e API https://www.dnd5eapi.co/api/2014/
// spell name, spell lvl
// casting time, range, components, duration
// description
// at higher levels

const baseUrl = 'https://www.dnd5eapi.co';
let sortOrder = 'A-Z';
let allSpells = [];

const getAllSpells = async () => {
	try {
		const spellIndexes = await fetch(
			baseUrl + '/api/2014/classes/druid/spells'
		).then((response) => response.json());

		const first40 = spellIndexes.results.slice(0, 40);

		for (let i = 0; i < first40.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 1));
			const response = await fetch(baseUrl + first40[i].url);
			const data = await response.json();
			allSpells.push(data);
		}
		renderSpells();
	} catch (err) {
		console.error('Error fetching spells: ', err);
		return [];
	}
};

getAllSpells();

const buttonAZ = document.getElementById('sort-az');
const buttonZA = document.getElementById('sort-za');

const sortAZ = () => {
	allSpells.sort((a, b) => a.name.localeCompare(b.name));
	renderSpells();
};

const sortZA = () => {
	allSpells.sort((a, b) => b.name.localeCompare(a.name));
	renderSpells();
};
const isPrepared = (spell) => {
	return false;
};

const createCard = (spell) => {
	const container = document.getElementById('spells-list');
	const card = document.createElement('div');
	card.classList.add('spell-container');

	card.innerHTML = `
		<div class="spell-name">
			<h2 class="text">${spell.name}</h2>
		</div>
		<span class="text">${spell.level}-level ${spell.school.name}</span>

		<div class="spell-grid">
			<div class="spell-stat">
				<h3>CASTING TIME</h3>
				<p class="text">${spell.casting_time}</p>
			</div>
			<div class="spell-stat">
				<h3>RANGE</h3>
				<p class="text">${spell.range}</p>
			</div>
			<div class="spell-stat">
				<h3>COMPONENTS</h3>
				<p class="text">${spell.components.join(', ')}</p>
			</div>
			<div class="spell-stat">
				<h3>DURATION</h3>
				<p class="text">${spell.duration}</p>
			</div>
	</div>

	<div class="spell-description">
		<p>${spell.desc ? spell.desc.join(' ') : 'No description was available.'}</p>
	</div>

	${
		spell.higher_level && spell.higher_level.length
			? `
	<div class="at-higher-levels">
		<p>${spell.higher_level.join(' ')}</p>
	</div>`
			: ''
	}

	<div class="class-name">Druid</div>
	<button>${isPrepared ? 'Remove' : 'Prepare'}</button>
`;
	container.appendChild(card);
};

const renderSpells = () => {
	const container = document.getElementById('spells-list');
	container.innerHTML = '';
	allSpells.forEach((spell) => createCard(spell));
};

buttonAZ.addEventListener('click', sortAZ);
buttonZA.addEventListener('click', sortZA);
