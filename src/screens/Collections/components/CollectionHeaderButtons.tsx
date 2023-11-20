import { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from "@apollo/client";
import { CHANGE_COLLECTION_LOCK, DELETE_COLLECTION, GET_COLLECTION, GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_FOR_PHRASES } from "../../../query/collections";
import EditCollection from "./EditCollection";
import { fontColor } from "@styles/variables";
import { useClickOutside } from "react-native-click-outside";

function CollectionHeaderButtons({ route, navigation }: any) {
	const colId = route.params.colId;
	const { data, refetch } = useQuery(GET_COLLECTION, { variables: { id: colId } });
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ deleteCollection ] = useMutation(DELETE_COLLECTION);
	const [ changeCollectionLock ] = useMutation(CHANGE_COLLECTION_LOCK);
	const [ displayMenu, setDisplayMenu ] = useState(false);
	const ref = useClickOutside(() => setDisplayMenu(false));

	useEffect(() => {
		if(!data) return;

		navigation.setOptions({
			headerStyle: {
				backgroundColor: data.getCollection.color
			},
			headerTintColor: "white"
		})
	}, [data])

	if(!data) return null;

	function deleteHandler() {
		Alert.alert(`Delete collection ${data.getCollection.name}?`, "", [
			{
				text: "Cancel",
				style: "cancel"
			},
			{
				text: "Delete",
				onPress: () => {
					deleteCollection({
						variables: { id: colId },
						refetchQueries: [GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_FOR_PHRASES]
					});
					navigation.navigate("Collections");
				}
			}
		])
	}

	function setLockHandler() {
		changeCollectionLock({
			variables: { 
				id: colId,
				input: {
					isLocked: !data.getCollection.isLocked
				}
			}
		})
		refetch();
	}

	return (
		<View style={styles.container}>
			<Modal
				visible={displayModal}
				transparent={true}
				animationType="slide"
			>
				<View
					style={styles.modalContainer}
				>
					<View
						style={styles.modal}
					>
						<TouchableOpacity
							onPress={() => setDisplayModal(false)}
							style={styles.modalBtn}
						>
							<Ionicons name="close" color="gray" size={24} />
						</TouchableOpacity>
						<EditCollection mutateId={data.getCollection.id} onReady={() => setDisplayModal(false)} />
					</View>
				</View>
			</Modal>
			<TouchableOpacity
				activeOpacity={0.75}
				onPress={() => setDisplayMenu(true)}
				style={styles.menuContainer}
			>
				<Ionicons name="ellipsis-vertical" size={24} color="#eee" />
				{
					displayMenu &&
					<View style={styles.menuBody} ref={ref}>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => navigation.navigate("Learn", { colId })}
							style={styles.menuItem}
						>
							<Text style={styles.menuItemText}>
								Learn
							</Text>
							<Ionicons name="book" size={21} color="gray" />
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={setLockHandler}
							style={styles.menuItem}
						>
							<Text style={styles.menuItemText}>
								{data.getCollection.isLocked ? "Unlock" : "Lock"}
							</Text>
							<Ionicons name={data.getCollection.isLocked ? "lock-open" : "lock-closed"} size={21} color="gray" />
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={() => setDisplayModal(true)}
							style={styles.menuItem}
						>
							<Text style={styles.menuItemText}>
								Edit
							</Text>
							<Ionicons name="pencil" size={21} color="gray" />
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={deleteHandler}
							style={styles.menuItem}
						>
							<Text style={styles.menuItemText}>
								Delete
							</Text>
							<Ionicons name="trash-outline" size={21} color="gray" />
						</TouchableOpacity>
					</View>
				}
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 15,
		paddingHorizontal: 15,
		alignItems: "center"
	},
	modalContainer: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff88"
	},
	modal: {
		width: 300,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		padding: 20,
		position: "relative",
		backgroundColor: "white"
	},
	modalBtn: {
		position: "absolute",
		top: 5,
		right: 5
	},
	menuContainer: {
		position: "relative"
	},
	menuBody : {
		position: "absolute",
		top: 0,
		right: 0,
		width: 160,
		padding: 12,
		borderRadius: 4,
		gap: 11,
		backgroundColor: "white"
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		justifyContent: "space-between"
	},
	menuItemText: {
		fontSize: 16,
		color: fontColor
	}
})

export default CollectionHeaderButtons;