import React, { useState } from 'react';
import { Container, Grid, Heading, Flex, Stack, Button, Spinner } from '@chakra-ui/react';
import { MdExpandMore } from 'react-icons/md';
import { useQuery } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';
import Card from '../components/card';
import * as GetPeopleListTypes from '../graphql/__generated__/GetPeople';
import { GET_PEOPLE } from '../graphql/getPeople';

interface PeopleProps extends RouteComponentProps {}

const Characters: React.FC<PeopleProps> = () => {
	const { data, loading, error, fetchMore } = useQuery<
		GetPeopleListTypes.GetPeople,
		GetPeopleListTypes.GetPeopleVariables
	>(GET_PEOPLE);
	const [ isLoadingMore, setIsLoadingMore ] = useState(false);

	if (loading) return <div>Loading</div>;
	if (error || !data) return <p>ERROR</p>;
	console.log(data);

	return (
		<React.Fragment>
			<Container centerContent maxW="xl" py="4" mt="20">
				<Heading as="h3" fontWeight={700} fontSize="lg" mr={2} mb={10}>
					Starwars Characters
				</Heading>
				<Grid
					templateColumns={{
						base: 'repeat(1, 1fr)',
						sm: 'repeat(2, 1fr)',
						md: 'repeat(3, 1fr)',
						lg: 'repeat(3, 1fr)'
					}}
					gap={4}
					mt={10}
				>
					{data.people &&
						data.people.people &&
						data.people.people.map((individual: any) => {
							return <Card key={individual.id} person={individual} />;
						})}
					{data.people &&
						data.people.hasMore &&
						(isLoadingMore ? (
							<Spinner color="green.50" />
						) : (
							<Flex justifyContent="center" mt={5}>
								<Stack>
									<Button
										bg="blue.200"
										color="gray.800"
										_hover={{ bg: 'green.400', color: 'white' }}
										onClick={async () => {
											setIsLoadingMore(true);
											await fetchMore({
												variables: {
													cursor: data.people.cursor
												}
											});
											setIsLoadingMore(false);
										}}
									>
										{<MdExpandMore />}
										Load more
									</Button>
								</Stack>
							</Flex>
						))}
				</Grid>
			</Container>
		</React.Fragment>
	);
};

export default Characters;
