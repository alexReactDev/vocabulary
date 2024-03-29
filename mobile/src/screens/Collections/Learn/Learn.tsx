import { useQuery } from "@apollo/client";
import { GET_COLLECTION_META } from "@query/collections";
import { StackScreenProps } from "@react-navigation/stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigatorParams } from "../Collections";
import Loader from "@components/Loaders/Loader";
import ErrorComponent from "@components/Errors/ErrorComponent";
import moment from "moment";
import { borderColor, fontColor, fontColorFaint } from "@styles/variables";
import { Ionicons } from '@expo/vector-icons';

type Props = StackScreenProps<StackNavigatorParams, "Learn", "collectionsNavigator">;

function Learn({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, error, loading } = useQuery(GET_COLLECTION_META, { variables: { id: colId } });

	if(loading) return <Loader />

	if(error || data?.errors?.length > 0) return <ErrorComponent message={error || data?.errors[0]} />

	const collection = data?.getCollection;

	const lastRepetition = collection.meta.lastRepetition ? moment(collection.meta.lastRepetition).fromNow() : "Never";

	return (
		<View style={styles.container}>
			<View style={styles.data}>
				<Text style={styles.title}>
					Choose your way to learn
				</Text>
				<Text style={styles.subtitle}>
					Collection "{collection.name}"
				</Text>
				<View style={styles.dataValues}>
					<Text style={styles.text}>
						Phrases: {collection.meta.phrasesCount}
					</Text>
					<Text style={styles.text}>
						Repetitions: {collection.meta.repetitionsCount}
					</Text>
					<Text style={styles.text}>
						Last repetition: {lastRepetition}
					</Text>
				</View>
			</View>
			<View style={styles.buttons}>
				<TouchableOpacity 
					style={styles.card} 
					activeOpacity={0.7}
					onPress={() => navigation.navigate("Cards", { colId })}
				>
					<View style={styles.cardIconContainer} />
					<View style={styles.cardIconContainer}>
						<Ionicons name="copy" size={16} color="darkgrey" />
						<Text style={styles.cardTitle}>
							Cards
						</Text>
					</View>
					<Text style={styles.cardText}>
						Classic flip cards with translation on other side
					</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.card} 
					activeOpacity={0.7}
					onPress={() => navigation.navigate("AIGeneratedText", { colId })}
				>
					<View style={styles.cardIconContainer}>
						<Ionicons name="text" size={16} color="grey" />
						<Text style={styles.cardTitle}>
							AI generated text
						</Text>
					</View>
					<Text style={styles.cardText}>
						Text generated by ChatGPT that includes words from your collection
					</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.card} 
					activeOpacity={0.7}
					onPress={() => navigation.navigate("Description", { colId })}
				>
					<View style={styles.cardIconContainer}>
						<Ionicons name="reader" size={16} color="grey" />
						<Text style={styles.cardTitle}>
							Description
						</Text>
					</View>
					<Text style={styles.cardText}>
						Guess word by description or hint sentence generated by ChatGPT
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%"
	},
	data: {
		height: "30%",
		alignItems: "center",
		justifyContent: "center"
	},
	buttons: {
		height: "70%",
		borderTopWidth: 1,
		borderTopColor: "grey",
		backgroundColor: "#f7f7f7",
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: 15,
		justifyContent: "space-between",
		paddingHorizontal: "7.5%",
		paddingVertical: 15
	},
	title: {
		marginBottom: 4,
		fontSize: 24,
		textAlign: "center",
		color: fontColor
	},
	subtitle: {
		marginBottom: 10,
		fontSize: 20,
		textAlign: "center",
		color: fontColor
	},
	dataValues: {

	},
	text: {
		color: fontColorFaint
	},
	card: {
		width: "48%",
		height: "40%",
		borderWidth: 1,
		borderColor: borderColor,
		borderRadius: 5,
		padding: 5,
		backgroundColor: "#fcfcfc"
	},
	cardIconContainer: {
		flexDirection: "row",
		gap: 5
	},
	cardTitle: {
		marginBottom: 3,
		fontSize: 16,
		color: fontColor
	},
	cardText: {
		color: fontColorFaint,
		fontSize: 12,
		lineHeight: 17
	}
})

export default Learn;