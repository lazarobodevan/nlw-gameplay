import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../../hooks/auth";
import { RectButton } from "react-native-gesture-handler";

import {Avatar} from '../Avatar';
import { styles } from "./styles";
import { Alert } from "react-native";

export function Profile(){

    const {user, signOut} = useAuth();

    function handleSignOut(){
        Alert.alert('Logout', 'Deseja sair?',
        [
            {
                text: 'Não',
                style: 'cancel'
            },
            {
                text:'sim',
                onPress:() => signOut()
            }
        ])        
    }

    return(


        <View style={styles.container}>
            <RectButton onPress={handleSignOut}>
                <Avatar urlImage={user.avatar}/>
            </RectButton>

            <View>
                <View style={styles.user}>
                    <Text style={styles.greeting}>
                        Olá, 
                    </Text>

                    <Text style={styles.username}>
                        {user.username.split(' ')[0]}
                    </Text>
                </View>

                <Text style={styles.message}>
                    Hoje é dia de derrota
                </Text>
            </View>
        </View>
    )
}