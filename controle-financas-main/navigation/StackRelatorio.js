import { StyleSheet, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import TelaRelatorio from "../screens/Reports/TelaRelatorio";

const Stack = createStackNavigator();

const name = 'Usuário';

const StackRelatorio = () => {
    return (
        <Stack.Navigator initialRouteName="RelatorioVisaoGeral"
            screenOptions={{
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="RelatorioVisaoGeral"
                component={TelaRelatorio}
                options={{ title: 'Meus Relatórios' }}
            />
        </Stack.Navigator>
    );
}

export default StackRelatorio;