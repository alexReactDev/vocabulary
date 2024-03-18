import { skipTutorial } from "@utils/tutorial";
import { Button, StyleSheet, Text, View } from "react-native";

function AutoCollectionsTutorial({ onClose }: { onClose: () => void}) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Tutorial. AutoCollections
			</Text>
			<Text style={styles.text}>
				Autocollections are collections automatically generated by the app.
			</Text>
			<Text style={styles.text}>
				Interval collection includes phrases chosen based on their last repetition time, approximately those that were repeated 1, 7, 30 and 90 days ago (you can edit precise behavior in settings). This way of learning helps you to not forget phrases you've learned while ago.
			</Text>
			<Text style={styles.text}>
				Hard to memorize collection includes phrases chosen based on amount of correct or incorrect answers during learning, namely those that have bigger amount of incorrect answers comparing to correct ones.
			</Text>
			<Text style={styles.text}>
				Auto collection is set of phrases selected by app algorithms. Currently, it based on last repetition time, percentage of correct answers and total amount of repetitions. However, it can be changed in the future.
			</Text>
			<View style={styles.btnContainer}>
				<Button 
					onPress={() => {
						onClose();
						skipTutorial();
					}} 
					title="Skip tutorial"
					color={"#f3a571"}
				/>
				<View style={styles.btn}>
					<Button onPress={onClose} title="OK" color={"#799dea"} />
				</View>
			</View>
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
		gap: 10
	},
	title: {
		fontSize: 18,
		textAlign: "center"
	},
	text: {
		fontSize: 15,
		lineHeight: 20,
		textAlign: "center"
	},
	btnContainer: {
		marginTop: 10,
		flexDirection: "row",
		justifyContent: "space-between"
	},
	btn: {
		minWidth: 60
	}
});

export default AutoCollectionsTutorial;