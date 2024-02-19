import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ICollection } from "@ts/collections";
import moment from "moment";
import { fontColorFaintLight, fontColorLight } from "../../../styles/variables";
import { Ionicons } from '@expo/vector-icons';

interface IProps {
	collection: ICollection,
	navigation: any
}

function CollectionCard({ collection, navigation }: IProps) {
	//@ts-ignore moment accepts timestamps (bigint type)
	const lastUpdate = moment(collection.lastUpdate).fromNow();

	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("Collection", { colId: collection.id})}
			activeOpacity={0.8}
			style={{backgroundColor: collection.color, ...styles.container}}
			key={collection.id}
		>
			<View>
				<Text style={styles.title}>
					{collection.name}
				</Text>
				{
					collection.isAutoGenerated
					?
					<Text style={styles.subtitle}>
					<Ionicons name="flash" size={18} color="lightgrey" />
						{" Auto generated collection"}
					</Text> 
					:
					<>					
						<Text style={styles.subtitle}>
							Words: {collection.meta.phrasesCount}
						</Text>
						<Text style={styles.bottomNote}>
							Last update: {lastUpdate}
						</Text>
					</>
				}
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		width: "47%",
		height: 165,
		justifyContent: "space-between",
		borderRadius: 10
	},
	title: {
		marginBottom: 3,
		fontSize: 18,
		color: fontColorLight
	},
	subtitle: {
		color: fontColorFaintLight,
		lineHeight: 18,
		marginBottom: 2
	},
	bottomNote: {
		color: fontColorFaintLight,
		fontSize: 11
	}
})

export default CollectionCard;