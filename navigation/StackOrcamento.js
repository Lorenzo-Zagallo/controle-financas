import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TelaOrcamento from '../screens/Budgets/TelaOrcamento';
import TelaAddCategoria from '../screens/Budgets/TelaAddCategoria';

const Stack = createStackNavigator();

const StackOrcamento = () => {
    return (
        <Stack.Navigator
            initialRouteName="OrçamentoVisaoGeral"
            screenOptions={{
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="OrçamentoVisaoGeral"
                component={TelaOrcamento}
                options={{ title: 'Meus Orçamentos' }}
            />
            <Stack.Screen
                name="AdicionarCategoria"
                component={TelaAddCategoria}
                options={{ title: 'Adicionar Categoria' }}
            />
        </Stack.Navigator>
    );
};

export default StackOrcamento;