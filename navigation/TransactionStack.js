import { createStackNavigator } from '@react-navigation/stack';

import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import AddTransactionScreen from '../screens/Transactions/AddTransactionScreen';

const Stack = createStackNavigator();

const TransactionStack = () => {
    return (
        <Stack.Navigator initialRouteName="TransactionsOverview"
            screenOptions={{
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}>
            <Stack.Screen
                name="TransactionsOverview"
                component={TransactionsScreen}
                options={{ title: 'Minhas Transações' }} />
            <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={{ title: 'Nova Transação' }} />
        </Stack.Navigator>
    );
};

export default TransactionStack;