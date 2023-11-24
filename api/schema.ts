const { buildSchema } = require("graphql");

const schema = buildSchema(`

	type PhraseMeta {
		guessed: Int,
		forgotten: Int,
		lastRepetition: Float
	}

	type Phrase {
		id: ID,
		value: String,
		translation: String,
		created: Float,
		lastUpdate: Float,
		meta: PhraseMeta,
		profile: ID
	}

	type CollectionMeta {
		phrasesCount: Int,
		repetitionsCount: Int,
		lastRepetition: Float
	}

	type AutoGeneratedCollectionMeta {
		type: String
	}

	type Collection {
		id: ID,
		name: String,
		isLocked: Boolean,
		isAutoGenerated: Boolean,
		color: String,
		created: Float,
		lastUpdate: Float,
		profile: ID,
		meta: CollectionMeta,
		autoGeneratedCollectionMeta: AutoGeneratedCollectionMeta
		phrases: [ID],
		repetitions: [ID]
	}

	type PhraseRepetition {
		id: ID,
		guessed: Int,
		forgotten: Int
	}

	type Repetition {
		id: ID,
		userId: ID,
		phrasesCount: Int,
		totalForgotten: Int,
		collectionName: String,
		repetitionType: String,
		repetitionsAmount: Int,
		phrasesRepetitions: [PhraseRepetition],
		created: Float
	}

	type Profile {
		id: ID,
		name: String,
		userId: ID
	}

	type Settings {
		theme: String,
		phrasesOrder: String,
		repetitionsAmount: Int,
		activeProfile: ID,
		autoCollectionSize: Int,
		intervalRepetitionDates: String
	}

	type UserSettings {
		id: ID,
		userId: ID,
		settings: Settings
	}

	type TokenData {
		token: String,
		sid: String,
		userId: String
	}

	type Session {
		sid: String,
		userId: String
	}

	type User {
		id: ID,
		name: String,
		login: String,
		created: Float
	}

	type Query {
		getCollection(id: ID): Collection,
		getProfileCollections(id: ID): [Collection],
		getCollectionPhrases(id: ID): [Phrase],
		getPhrase(id: ID): Phrase,
		getPhraseCollection(id: ID): Collection,
		getUserProfiles(id: ID): [Profile],
		getSession: Session,
		getUserSettings(id: ID): UserSettings,
		getUser(id: ID): User,
		getUserRepetitions(userId: ID): [Repetition]
	}

	input ProfileInput {
		name: String!,
		userId: ID!
	}

	input MutateProfileInput {
		name: String
	}

	input UserInput {
		name: String!,
		login: String!,
		password: String!,
	}

	input PhraseInput {
		value: String!,
		translation: String!
	}

	input CollectionInput {
		name: String!,
		color: String!,
		profile: ID!
	}

	input CollectionMetaInput {
		repetitionsCount: Int,
		lastRepetition: Float
	}

	input ChangeCollectionLockInput {
		isLocked: Boolean
	}

	input PhraseMetaInput {
		guessed: Int,
		forgotten: Int,
		lastRepetition: Float
	}

	input SettingsInput {
		theme: String!,
		phrasesOrder: String!,
		repetitionsAmount: String!,
		activeProfile: ID!
	}

	input PartialSettingsInput {
		theme: String,
		phrasesOrder: String,
		repetitionsAmount: Int,
		activeProfile: ID
	}

	input LoginInput {
		login: String!,
		password: String!
	}

	input SignUpInput {
		name: String!,
		login: String!,
		password: String!
	}

	input PhraseRepetitionInput {
		id: ID,
		guessed: Int,
		forgotten: Int
	}

	input RepetitionInput {
		userId: ID,
		phrasesCount: Int,
		totalForgotten: Int,
		collectionName: String,
		repetitionType: String,
		repetitionsAmount: Int,
		phrasesRepetitions: [PhraseRepetitionInput],
		created: Float
	}

	type Mutation {
		deletePhrase(id: ID): String,
		deleteCollection(id: ID): String,
		mutatePhrase(id: ID, input: PhraseInput, collection: ID): String,
		mutatePhraseMeta(id: ID, input: PhraseMetaInput): String,
		mutateCollection(id: ID, input: CollectionInput): String,
		mutateCollectionMeta(id: ID, input: CollectionMetaInput): String,
		changeCollectionLock(id: ID, input: ChangeCollectionLockInput): String,
		createPhrase(input: PhraseInput, collection: ID): Phrase,
		createCollection(input: CollectionInput): String,
		createUser(input: UserInput): String,
		createProfile(input: ProfileInput): String,
		mutateProfile(id: ID, input: MutateProfileInput): String,
		deleteProfile(id: ID): String
		updateUserSettings(id: ID, input: PartialSettingsInput): UserSettings,
		setUserSettings(id: ID, input: SettingsInput): String,
		login(input: LoginInput): TokenData,
		signUp(input: SignUpInput): TokenData,
		logout: String,
		deleteUser(id: ID): String,
		createRepetition(input: RepetitionInput): String,
		generateAutoCollection(type: String): Collection
	}
`);

module.exports = schema;