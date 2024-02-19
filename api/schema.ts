import { buildSchema } from "graphql";

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
		profile: ID,
		collection: ID,
		userId: String
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
		repetitions: [ID],
		userId: String
	}

	type AutoCollection {
		id: ID,
		name: String,
		isLocked: Boolean,
		isAutoGenerated: Boolean,
		color: String,
		created: Float,
		lastUpdate: Float,
		profile: ID,
		meta: CollectionMeta,
		repetitions: [ID],
		userId: String,
		autoGeneratedCollectionMeta: AutoGeneratedCollectionMeta,
		phrases: [ID]
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
		disableAutoCollections: Boolean,
		autoCollectionsSize: Int,
		intervalRepetitionDates: String,
		useGPT3: Boolean,
		textDifficulty: String,
		disableSuggestions: Boolean,
		suggestionsLanguage: String
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

	type Language {
		value: String,
		name: String
	}

	type VerificationStatus {
		isVerified: Boolean
	}

	type Query {
		getCollection(id: ID!): Collection,
		getProfileCollections(id: ID!): [Collection],
		getCollectionPhrases(id: ID!): [Phrase],
		getPhrase(id: ID!): Phrase,
		getPhraseCollection(id: ID!): Collection,
		getUserProfiles(id: ID!): [Profile],
		getSession: Session,
		getUserSettings(id: ID!): UserSettings,
		getUserRepetitions(userId: ID!): [Repetition],
		getGeneratedText(phrases: [String]!): String,
		getGeneratedSentences(phrases: [String]!): [String],
		getTranslatedText(input: String!): String,
		getSupportedLanguages: [Language],
		checkVerificationCode(email: String!, code: String!): String,
		getVerificationStatus(userId: String!): VerificationStatus,
		searchCollectionPhrases(pattern: String!, colId: ID!): [Phrase],
		searchProfilePhrases(pattern: String!, profile: ID!): [Phrase],
		searchProfileCollections(pattern: String!, profile: ID!): [Collection]
	}

	input ProfileInput {
		name: String!,
		userId: ID!
	}

	input MutateProfileInput {
		name: String!
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

	input MutateCollectionInput {
		name: String!,
		color: String!
	}

	input CollectionMetaInput {
		repetitionsCount: Int!,
		lastRepetition: Float!
	}

	input ChangeCollectionLockInput {
		isLocked: Boolean!
	}

	input PhraseMetaInput {
		guessed: Int!,
		forgotten: Int!,
		lastRepetition: Float!
	}

	input SettingsInput {
		theme: String!,
		phrasesOrder: String!,
		repetitionsAmount: String!,
		activeProfile: ID!,
		disableAutoCollections: Boolean!,
		autoCollectionsSize: Int!,
		intervalRepetitionDates: String!,
		textDifficulty: String!,
		useGPT3: Boolean!,
		disableSuggestions: Boolean!,
		suggestionsLanguage: String!
	}

	input PartialSettingsInput {
		theme: String,
		phrasesOrder: String,
		repetitionsAmount: Int,
		activeProfile: ID,
		disableAutoCollections: Boolean,
		autoCollectionsSize: Int,
		intervalRepetitionDates: String,
		textDifficulty: String,
		useGPT3: Boolean,
		disableSuggestions: Boolean,
		suggestionsLanguage: String
	}

	input LoginInput {
		email: String!,
		password: String!
	}

	input SignUpInput {
		email: String!,
		password: String!
	}

	input PhraseRepetitionInput {
		id: ID!,
		guessed: Int!,
		forgotten: Int!
	}

	input RepetitionInput {
		userId: ID!,
		phrasesCount: Int!,
		totalForgotten: Int!,
		collectionName: String!,
		repetitionType: String!,
		repetitionsAmount: Int!,
		phrasesRepetitions: [PhraseRepetitionInput]!,
		created: Float!
	}

	input ChangePasswordInput {
		oldPassword: String!,
		newPassword: String!
	}

	input resetPasswordInput {
		email: String!,
		code: String!,
		newPassword: String!
	}

	type Mutation {
		deletePhrase(id: ID!): String,
		deletePhrasesMany(ids: [ID]!): String,
		deleteCollection(id: ID!): String,
		mutatePhrase(id: ID!, input: PhraseInput!): String,
		movePhrase(id: ID!, destId: ID!): String,
		movePhrasesMany(ids: [ID]!, destId: ID!): String,
		mutatePhraseMeta(id: ID!, input: PhraseMetaInput!): String,
		mutateCollection(id: ID!, input: MutateCollectionInput!): String,
		mutateCollectionMeta(id: ID!, input: CollectionMetaInput!): String,
		changeCollectionLock(id: ID!, input: ChangeCollectionLockInput!): String,
		createPhrase(input: PhraseInput!, collection: ID!): Phrase,
		createCollection(input: CollectionInput!): String,
		createUser(input: UserInput!): String,
		createProfile(input: ProfileInput!): String,
		mutateProfile(id: ID!, input: MutateProfileInput!): String,
		deleteProfile(id: ID!): String
		updateUserSettings(id: ID!, input: PartialSettingsInput!): UserSettings,
		setUserSettings(id: ID!, input: SettingsInput!): String,
		login(input: LoginInput!): TokenData,
		signUp(input: SignUpInput!): TokenData,
		logout: String,
		deleteUser(id: ID!, password: String!): String,
		createRepetition(input: RepetitionInput!): String,
		generateAutoCollection(type: String!): AutoCollection,
		changePassword(userId: ID!, input: ChangePasswordInput!): String,
		sendVerificationCode(email: String!): String,
		resetPassword(input: resetPasswordInput!): TokenData,
		verifyEmail(userId: String!): String
	}
`);

export default schema;