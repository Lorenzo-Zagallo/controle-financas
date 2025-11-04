import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import BudgetStack from './BudgetStack';
import TransactionsStack from './TransactionStack';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator initialRouteName='Dashboard'
            screenOptions={{
                headerShown: false, // esconde o cabecalho no topo
                tabBarActiveTintColor: '#007bff', // cor do ícone e texto ativo
                tabBarInactiveTintColor: 'gray', // cor do ícone e texto inativo
            }} >
            <Tab.Screen name="Dashboard"
                component={DashboardScreen}
                options={{
                    title: 'Visão Geral',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="TransactionsTab" component={TransactionsStack}
                options={{
                    title: 'Transações', tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="BudgetsTab" component={BudgetStack}
                options={{
                    title: 'Orçamentos', tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Reports" component={ReportsScreen}
                options={{
                    title: 'Relatórios', tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" color={color} size={size} />
                    ),
                }} />
        </Tab.Navigator>
    );
};

export default TabNavigation;