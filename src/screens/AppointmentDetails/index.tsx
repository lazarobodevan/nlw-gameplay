import React, { useState, useEffect } from "react";
import { ImageBackground, Text, View, FlatList, Share, Platform} from "react-native";
import { Background } from "../../components/Background";
import { Header } from "../../components/Header";
import { ListHeader } from "../../components/ListHeader";
import { Member, MemberProps } from "../../components/Member";
import {BorderlessButton} from 'react-native-gesture-handler'
import {Fontisto} from '@expo/vector-icons';
import { theme } from "../../@global/styles/theme";
import BannerImg from '../../assets/banner.png';
import {styles} from './styles';
import { ListDivider } from "../../components/ListDivider";
import { ButtonIcon } from "../../components/ButtonIcon";
import { useRoute } from "@react-navigation/native";
import { AppointmentProps } from "../../components/Appointment";
import { Alert } from "react-native";
import { api } from "../../services/api";

import * as Linking from 'expo-linking';

import {Loading} from '../../components/Loading';


type Params = {
    guildSelected: AppointmentProps;
}

type GuildWidget = {
    id: string;
    name: string;
    instant_invite: string;
    members: MemberProps[];
}

export function AppointmentDetails(){
    
    const route = useRoute();

    const {guildSelected} = route.params as Params;

    const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);
    const [loading, setLoading] = useState(true);

    async function fetchGuildWidget(){
        try{
            const response = await api.get(`/guild/${guildSelected.guild.id}/widget.json`);
            setWidget(response.data);
            setLoading(false);

        }catch(error){
            Alert.alert("Confira se o widget está habilitado no seu servidor! Erro!");
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchGuildWidget();
    },[]);


    function handleShareInvitation(){
        const message = Platform.OS === 'ios' ? `Junte-se a ${guildSelected.guild.name}`
        : widget.instant_invite;

        Share.share({
            message,
            url: widget.instant_invite
        });
    }

    function handleOpenGuild(){
        Linking.openURL(widget.instant_invite);
    }

    return(
        <Background>
            <Header
                title="Detalhes"
                action={
                    guildSelected.guild.owner &&
                    <BorderlessButton onPress={handleShareInvitation}>
                        <Fontisto
                            name="share"
                            size={24}
                            color={theme.colors.primary}
                        />
                    </BorderlessButton>

                }
            />

            <ImageBackground 
                source={BannerImg}
                style={styles.banner}
            >
                <View style={styles.bannerContent}>
                    <Text style={styles.title}>
                        {guildSelected.guild.name}
                    </Text>

                    <Text style={styles.subtitle}>
                        {guildSelected.description}
                    </Text>
                </View>

            </ImageBackground>
            <ListHeader
                title="Jogadores"
                subtitle={`Total: ${widget.members.length}`}
            />


                {
                    loading ? <Loading/>
                    :
                    <>
                        <FlatList
                            data={widget.members}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => (
                                <Member data={item}/>
                            )}
                            ItemSeparatorComponent={() => <ListDivider/>}
                            style={styles.members}
                        />

                        {
                            guildSelected.guild.owner &&
                            <View style={styles.footer}>
                                <ButtonIcon
                                    title="Entrar na partida"
                                    onPress={handleOpenGuild}
                                />
                            </View>
                        }

                    </>
                }
            
        </Background>
    )
}