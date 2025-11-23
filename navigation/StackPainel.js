import { StyleSheet, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import TelaPainel from "../screens/Dashboard/TelaPainel";

const Stack = createStackNavigator();

const name = 'Usuário';

const StackPainel = () => {
    return (
        <Stack.Navigator initialRouteName="Dashboard"
            screenOptions={{ headerShown: true }}>
            <Stack.Screen
                name="Dashboard"
                component={TelaPainel}
                options={{
                    headerTitle: () => (
                        <Text style={styles.baseTitle}>
                            Bem-vindo{' '}
                            <Text style={styles.name}>{name}</Text>
                        </Text>
                    ),
                    headerStyle: { backgroundColor: '#8e34ca' }
                }} />
        </Stack.Navigator>
    );
}

export default StackPainel;

const styles = StyleSheet.create({
    name: {
        fontWeight: 'bold',
    },
    baseTitle: {
        fontSize: 24,
        color: '#fff',
    },
});