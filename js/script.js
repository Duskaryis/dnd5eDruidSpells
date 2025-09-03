const baseUrl = 'https://www.dnd5eapi.co';
let allSpells = [];
let preparedSpells = [];

const setAllCounters = () => {
	setCounter('main');
	setCounter('prepared');
};

const getAllSpells = async (limit) => {
	try {
		const spellIndexes = await fetch(
			baseUrl + '/api/2014/classes/druid/spells'
		).then((response) => response.json());

		const first40 = spellIndexes.results.slice(0, limit || 40);

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

getAllSpells(40).then(() => {
	setAllCounters();
});

const setCounters = (container) => {
	const id = container === 'main' ? 'spells-total' : 'prepared-total';
	const source = container === 'main' ? allSpells : preparedSpells;
	const allSpellsCounter = document.getElementById('spells-total');
	const levelsValue = source.reduce(
		(acc, spell) => acc + (spell.level || 0),
		0
	);
	allSpellsCounter.innerText = levelsValue;
};

const buttonAZ = document.getElementById('sort-az');
const buttonZA = document.getElementById('sort-za');

const sortSpells = (order = 'A-Z') => {
	if (order === 'A-Z') {
		allSpells.sort((a, b) => a.name.localeCompare(b.name));
	} else if (order === 'Z-A') {
		allSpells.sort((a, b) => b.name.localeCompare(a.name));
	}
	renderSpells();
};

buttonAZ.addEventListener('click', () => sortSpells('A-Z'));
buttonZA.addEventListener('click', () => sortSpells('Z-A'));

const isPrepared = (spell) => {
	return preparedSpells.some((s) => s.index === spell.index);
};

const createCard = (spell) => {
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
	<button>${isPrepared(spell) ? 'Remove' : 'Prepare'}</button>
`;

	const button = card.querySelector('button');
	button.addEventListener('click', () => {
		if (button.innerText === 'Prepare') {
			allSpells = allSpells.filter((s) => s.index !== spell.index);
			preparedSpells.push(spell);
		} else if (button.innerText === 'Remove') {
			preparedSpells = preparedSpells.filter((s) => s.index !== spell.index);
			allSpells.push(spell);
		}
		renderSpells();
	});

	return card;
};

const renderSpells = () => {
	const spellsContainer = document.getElementById('spells-list');
	const preparedContainer = document.getElementById('prepared-spells');

	setAllCounters();

	spellsContainer.innerHTML = '';
	preparedContainer.innerHTML = '';

	allSpells.forEach((spell) => spellsContainer.appendChild(createCard(spell)));
	preparedSpells.forEach((spell) =>
		preparedContainer.appendChild(createCard(spell))
	);
};
