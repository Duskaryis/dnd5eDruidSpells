// using the dnd 5e API https://www.dnd5eapi.co/api/2014/
// spell name, spell lvl
// casting time, range, components, duration
// description
// at higher levels

const baseUrl = 'https://www.dnd5eapi.co';

let sortOrder = 'A-Z';

const getAllSpells = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	try {
		const spellIndexes = await fetch(
			baseUrl + '/api/2014/classes/druid/spells'
		).then((response) => response.json());

		const first40 = spellIndexes.results.slice(0, 40);

		return Promise.all(
			first40.map((spell) =>
				fetch(baseUrl + spell.url).then((response) => response.json())
			)
		);
	} catch (err) {
		console.error('Error fetching spells: ', err);
		return [];
	}
};

const loadPreparedSpells = () => {
	const data = localStorage.getItem('preparedSpells');
	return data ? JSON.parse(data) : [];
};

const renderSpells = (spells) => {
	const spellsList = document.getElementById('spells-list');
	const preparedE1 = document.getElementById('prepared-spells');

	let preparedSpells = loadPreparedSpells();

	const createSpellCard = (spell, isPrepared = false) => {
		const container = document.createElement('div');
		container.className = 'spell-container';

		container.innerHTML = `
	<div class="spell-name">
		<h2 class="text">${spell.name}</h2>
	</div>
	<span class="text">${spell.level}-level ${spell.school.name}</span>

	<div class="spell-grid">
		<div class="spell-stat">
			<h4>CASTING TIME</h4>
			<p class="text">${spell.casting_time}</p>
		</div>
		<div class="spell-stat">
			<h4>RANGE</h4>
			<p class="text">${spell.range}</p>
		</div>
		<div class="spell-stat">
			<h4>COMPONENTS</h4>
			<p class="text">${spell.components.join(', ')}</p>
		</div>
		<div class="spell-stat">
			<h4>DURATION</h4>
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

		const button = container.querySelector('button');
		button.addEventListener('click', () => {
			if (isPrepared) {
				preparedSpells = preparedSpells.filter((s) => s.name !== spell.name);
			} else {
				preparedSpells.push(spell);
			}
			savePreparedSpells(preparedSpells);
			renderSpells(allSpells); // assuming allSpells holds the fetched spells
		});
		return container;
	};

	preparedE1 = '';
	sortedPrepared.forEach((spell) => {
		preparedE1.appendChild(createSpellCard(spell, true));
	});

	spellsList.innerHTML = '';
	sortedSpells.forEach((spell) => {
		spellsList.appendChild(createSpellCard(spell, false));
	});
	updateTotals(sortedSpells, sortedPrepared);
};
