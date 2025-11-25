import { createStackNavigator } from '@react-navigation/stack';

import TelaAddTransacao from '../screens/Transactions/TelaAddTransacao';
import TelaTransacao from '../screens/Transactions/TelaTransacao';

const Stack = createStackNavigator();

const StackTransacao = () => {
    return (
        <Stack.Navigator initialRouteName="TransacaoVisaoGeral"
            screenOptions={{
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}>
            <Stack.Screen
                name="TransacaoVisaoGeral"
                component={TelaTransacao}
                options={{ title: 'Minhas Transações' }} />
            <Stack.Screen
                name="AdicionarTransacao"
                component={TelaAddTransacao}
                options={{ title: 'Nova Transação' }} />
        </Stack.Navigator>
    );
};

export default StackTransacao;