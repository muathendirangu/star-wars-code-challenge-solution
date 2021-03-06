const { paginateResults } = require('./paginate');
const resolvers = {
	Query: {
		people: async (_, { pageSize = 3, cursor }, { dataSources }) => {
			const allPeople = await dataSources.starwarsAPI.getPeople();
			const people = paginateResults({
				cursor,
				pageSize,
				results: allPeople
			});

			return {
				people,
				cursor: people.length ? people[people.length - 1].cursor : null,
				// if the cursor at the end of the paginated results is the same as the
				// last item in _all_ results, then there are no more results after this
				hasMore: people.length
					? people[people.length - 1].cursor !== allPeople[allPeople.length - 1].cursor
					: false
			};
		},
		individual: async (_, { name }, { dataSources }) => {
			const people = await dataSources.starwarsAPI.getPeople();
			const person = await people.filter((i) => i.name == name);
			return person;
		}
	}
};
module.exports = resolvers;
