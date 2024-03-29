import { useEffect } from "react";
import { getAuthToken, setAuthToken } from "../utils/authToken";
import { useQuery } from "@apollo/client";
import { GET_SESSION } from "../query/authorization";
import Welcome from "../screens/Welcome/Welcome";
import { IAuthData } from "../types/authorization";
import session from "../store/session";
import { observer } from "mobx-react-lite";
import ErrorComponent from "./Errors/ErrorComponent";
import { GET_USER_SETTING } from "../query/settings";
import settings from "../store/settings";
import LoadingScreen from "./Loaders/LoadingScreen";

const AuthorizationChecker = observer(function ({ children }: any) {
	const { data, error } = useQuery(GET_SESSION, { 
		context: {
			headers: {
				"Authorization": `Bearer ${session.data.token}`
			}
		}, 
		skip: !session.data.token  || !!session.data.sid
	});

	useEffect(() => {
		session.loadingStart();
		settings.loadingStart();

		getAuthToken().then((res) => {
			session.tokenLoaded(res);
		}).catch((err) => {
			session.sessionError(err);
		})
	}, []);

	useEffect(() => {
		if(!data) return;
		session.dataLoaded(data.getSession);
	}, [data]);
	
	useEffect(() => {
		if(!error) return;
		session.sessionError(error);
	}, [error]);

	const { data: settingsData, error: settingsError } = useQuery(GET_USER_SETTING, { variables: { id: session.data.userId }, skip: !session.data.sid });

	useEffect(() => {
		if(!settingsData) return;
		settings.settingsLoaded(settingsData.getUserSettings);
	}, [settingsData])

	useEffect(() => {
		if(!settingsError) return;
		settings.loadError(error);
	}, [error]);

	async function updateCredentials(data: IAuthData) {
		let savedToken;

		try {
			savedToken = await setAuthToken(data.token);
		} catch (e) {
			console.log(e);
		}

		session.dataLoaded(data);
	}

	if(session.error) {
		return <ErrorComponent message={`Failed to load session. \n ${session.error}`} />
	}

	if(settingsError) {
		return <ErrorComponent message={`Failed to load settings. \n ${settingsError}`} />
	}

	if(session.loading || (!session.loaded && !session.error)) return <LoadingScreen />

	if(!session.data.token || !session.data.sid) return <Welcome updateCredentials={updateCredentials} />

	if(settings.loading || (!settings.loaded && !settings.error)) return <LoadingScreen />

	return children;
});

export default AuthorizationChecker;