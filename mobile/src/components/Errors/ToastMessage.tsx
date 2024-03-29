import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { observer } from "mobx-react-lite";
import errorMessage from "@store/toastMessage";
import { bgColorAccent } from "@styles/variables";
import { useEffect } from "react";

const ErrorMessageToast = observer(function () {
	useEffect(() => {
		if(errorMessage.displayMessage) {
			const timeout = setTimeout(() => errorMessage.dismissErrorMessage(), 3000);
			
			return () => clearTimeout(timeout);
		}
	}, [errorMessage.displayMessage])
	
	if(!errorMessage.displayMessage) return "";

	return (
		<View style={styles.body}>
			<TouchableOpacity
				onPress={() => errorMessage.dismissErrorMessage()}
				style={styles.btn}
			>
				<Ionicons name="close" color="gray" size={24} />
			</TouchableOpacity>
			<Ionicons style={styles.icon} name={errorMessage.type === "error" ? "alert-circle-outline": "information-circle-outline"} size={22} color="gray" />
			<Text style={styles.message}>
				{errorMessage.message}
			</Text>
		</View>
	)
})

const styles = StyleSheet.create({
	body: {
		zIndex: 99,
		position: "absolute",
		right: 15,
		top: 30,
		paddingVertical: 10,
		paddingLeft: 8,
		paddingRight: 24,
		width: 210,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		backgroundColor: bgColorAccent
	},
	icon: {
		alignSelf: "flex-start",
		flexShrink: 0
	},
	message: {
		flex: 1,
		color: "darkgrey",
		fontWeight: "bold",
		textAlign: "center"
	},
	btn: {
		position: "absolute",
		right: 3,
		top: 9.5
	}
})

export default ErrorMessageToast;