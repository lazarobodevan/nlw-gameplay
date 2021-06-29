import React, {useState} from "react";
import { Text, View, ScrollView, KeyboardAvoidingView, Platform} from "react-native";
import uuid from 'react-native-uuid';

import { Background } from "../../components/Background";
import { Header } from "../../components/Header";
import { GuildIcon } from "../../components/GuildIcon";
import { CategorySelect } from "../../components/CategorySelect";
import { SmallInput } from "../../components/SmallInput";
import { TextArea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import { ModalView } from "../../components/ModalView";

import { Feather } from "@expo/vector-icons";

import {COLLECTION_APPOINTMENTS, COLLECTION_USERS} from '../../configs/database';
import { RectButton } from "react-native-gesture-handler";
import { theme } from "../../@global/styles/theme";
import {styles} from "./style";
import { Guilds } from "../Guilds";
import { GuildProps } from "../../components/Guild";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export function AppointmentCreate(){
    const [category, setCategory] = useState('1');

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [description, setDescription] = useState('');


    const [openGuildModal, setopenGuildModal] = useState(false);
    const [guild, setGuild] = useState<GuildProps>({} as GuildProps);

    const navigation = useNavigation();

    function handleOpenGuilds(){
        setopenGuildModal(true);
    }

    function handleCloseModeal(){
        setopenGuildModal(false);
    }

    function handleGuildSelect(guildSelect: GuildProps){
        setGuild(guildSelect);
        setopenGuildModal(false);
    }

    
    async function handleSave(){
        const newAppointment = {
            id: uuid.v4(),
            guild,
            category,
            date: `${day}/${month} às ${hour}:${minute}h`,
            description
        };
        
        const storage = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
        const appointments = storage ? JSON.parse(storage) : [];

        await AsyncStorage.setItem(
            COLLECTION_APPOINTMENTS,
            JSON.stringify([...appointments, newAppointment])
        );

        navigation.navigate('Home');
    }

    return(
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container} 
        >
            <ScrollView >
            <Background>
                <Header
                    title="Agendar partida"
                />

                <Text style={[
                            styles.label, 
                                {marginLeft: 24, 
                                marginTop: 36,
                                marginBottom: 18}
                            ]}
                >
                    Categoria
                </Text>

                <CategorySelect
                    hasCheckBox
                    setCategory={setCategory}
                    categorySelected={category}
                />

                <View style={styles.form}>
                    <RectButton onPress={handleOpenGuilds}>
                        <View style={styles.select}>
                            {
                                guild.icon ? <GuildIcon guildId={guild.id} iconId={guild.icon}/> : <View style={styles.image}/>
                            }

                            <View style={styles.selectBody}>
                                <Text style={styles.label}>
                                    {guild.name ? guild.name : 'Selecione um servidor'}
                                </Text>    
                            </View>

                            <Feather
                                name="chevron-right"
                                color={theme.colors.heading}
                                size={18}
                            />

                        </View>
                    </RectButton>

                    <View style={styles.field}>
                        <View>
                            <Text style={styles.label}>
                                Dia e mês
                            </Text>

                            <View style={styles.column}>

                                <SmallInput 
                                    maxLength={2}
                                    onChangeText={setDay}
                                />
                                <Text style={styles.divider}>
                                    /
                                </Text>
                                <SmallInput 
                                    maxLength={2}
                                    onChangeText={setMonth}                                
                                />

                            </View>

                        </View>

                        <View>
                            <Text style={styles.label}>
                                Hora e minuto
                            </Text>

                            <View style={styles.column}>

                                <SmallInput 
                                    maxLength={2}
                                    onChangeText={setHour}
                                />
                                <Text style={styles.divider}>
                                    :
                                </Text>
                                <SmallInput 
                                    maxLength={2}
                                    onChangeText={setMinute}
                                />

                            </View>

                        </View>

                    </View>


                    <View style={[styles.field, {marginBottom: 12}]}>
                        <Text style={styles.label}>
                            Descrição
                        </Text>

                        <Text style={styles.caracteresLimit}>
                            Max 100 caracteres
                        </Text>
                    </View>
                    <TextArea
                        multiline
                        maxLength={100}
                        numberOfLines={5}
                        autoCorrect={false}
                    />

                    <View style={styles.footer}>
                        <Button
                            title="Agendar"
                            onPress={handleSave}
                        />
                    </View>

                </View>

            </Background>
            </ScrollView>
            
            <ModalView visible={openGuildModal} closeModal={handleCloseModeal}>
                    <Guilds handleGuildSelect={handleGuildSelect}/>
            </ModalView>
        </KeyboardAvoidingView>
    )
}