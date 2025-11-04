import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importa as telas
import BudgetsScreen from '../screens/Budgets/BudgetsScreen';
import AddCategoryScreen from '../screens/Budgets/AddCategoryScreen';

const Stack = createStackNavigator();

const BudgetStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="BudgetsOverview"
            screenOptions={{
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="BudgetsOverview"
                component={BudgetsScreen}
                options={{ title: 'Meus Orçamentos' }}
            />
            <Stack.Screen
                name="AddCategory"
                component={AddCategoryScreen}
                options={{ title: 'Adicionar Categoria' }}
            />
        </Stack.Navigator>
    );
};

export default BudgetStack;