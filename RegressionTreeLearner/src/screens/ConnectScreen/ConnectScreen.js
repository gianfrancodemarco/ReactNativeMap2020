import React, {useState, useEffect, useContext} from 'react';
import ConnectScreenStyles from "./ConnectScreenStyles";
import {
    Text,
    SafeAreaView,
    Button,
    View,
    TextInput
} from 'react-native';
import {defaultLabelStyles} from '../GenericStyles'
import useSocket from "../../hooks/useSocket";
import {Actions} from 'react-native-router-flux'
import {Context} from '../../hooks/globalState/Store';
import MainLayout from '../MainLayout/MainLayout';
import {set} from 'react-native-reanimated';

export default function ConnectScreen() {

    const [state, dispatch] = useContext(Context)

    const defaultHost = "192.168.1.156:8080"
    const [host, setHost] = useState("192.168.1.156:8080")
    const [connected, connect, sendMessage, client, closeConnection] = useSocket()
    const [message, setMessage] = useState("")

    useEffect(() => {
        if(connected){
            dispatch({type:"UPDATE_SOCKET", payload:{socket: [connected, connect, sendMessage, client, closeConnection]}})
            dispatch({type:"LOADING", payload: {isLoading: false}})
            Actions.LoadDataset()
        }
    }, [connected])

    const connectToServer = () => {
        dispatch({type:"LOADING", payload: {isLoading:true}})
        connect(defaultHost.split(":"))
    }

    return (
            <MainLayout>
                <Button
                    {...hostButtonProps}
                    onPress={() => connectToServer()}
                    disabled={connected}
                />
                <Text style={defaultLabelStyles}>
                    or
                </Text>
                <View style={{flexDirection:"column"}}>
                    <TextInput
                        style={ConnectScreenStyles.hostInput}
                        value={host}
                        onChangeText={host => setHost(host)}
                    />
                    <Button disabled={connected} onPress={() => connect(host.split((":")))} {...goButtonProps}/>
                </View>

                <View style={{flexDirection:"column", marginTop: 20}}>
                    <TextInput
                        style={ConnectScreenStyles.hostInput}
                        value={message}
                        onChangeText={message => setMessage(message)}
                    />
                    <Button onPress={() => sendMessage(message)} {...sendMessageProps} disabled={!connected}/>
                </View>
            </MainLayout>
    );
}

const hostButtonProps = {
    color: 'hsla(215, 67%, 34%, 1)',
    title: "Connect to hosted server",
}

const goButtonProps = {
    color: 'hsla(215, 67%, 34%, 1)',
    title: "Go",
}

const sendMessageProps = {
    color: 'hsla(182, 24%, 86%, 1)',
    title: "Next",
}
