import React, {useState, useCallback} from "react";
import { View, FlatList } from "react-native";
import { ButtonAdd } from "../../components/ButtonAdd";
import { CategorySelect } from "../../components/CategorySelect";
import { Profile } from "../../components/Profile";
import { ListHeader } from "../../components/ListHeader";
import { Appointment, AppointmentProps } from "../../components/Appointment";
import { ListDivider } from "../../components/ListDivider";
import { Loading } from "../../components/Loading";

import { styles } from "./styles";
import { Background } from "../../components/Background";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLLECTION_APPOINTMENTS } from "../../configs/database";

export function Home(){

    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

    function handleCategorySelect(categoryId: string){
        categoryId === category ? setCategory('') : setCategory(categoryId);
    }

    function handleAppointmentDetails(guildSelected: AppointmentProps){
        navigation.navigate('AppointmentDetails',{guildSelected: guildSelected});
    }

    function handleAppointmentCreate(){
        navigation.navigate('AppointmentCreate');
    }

    async function loadAppointments(){
        const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
        const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

        if(category){
            setAppointments(storage.filter(item => item.category == category))
        }else{
            setAppointments(storage);
        }

        setLoading(false);

    }

    useFocusEffect(useCallback(() => {
        loadAppointments();
    },[category]));


    return(
        <Background>
            <View style={styles.header}>
                <Profile/>
                <ButtonAdd onPress={handleAppointmentCreate}/>
            </View>

            <CategorySelect
                categorySelected={category}
                setCategory={handleCategorySelect}
            />
            {
                loading ? <Loading/> :
                <>
                    <ListHeader
                        title="Partidas agendadas"
                        subtitle={`Total ${appointments.length}`}
                    />

                    <FlatList 
                        data={appointments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Appointment
                                data={item}
                                onPress={() => handleAppointmentDetails(item)}
                            />
                        )}
                        style={styles.matches}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <ListDivider/>}
                        contentContainerStyle={{paddingBottom: 69}}
                    />
                </>
            }

        </Background>
    );
}