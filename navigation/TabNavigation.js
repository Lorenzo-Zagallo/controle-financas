import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import TransactionsScreen from '../screens/Transactions/TransactionsScreen';
import BudgetsScreen from '../screens/Budgets/BudgetsScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName='Dashboard'
            screenOptions={{
                headerShown: false, // esconde o cabecalho no topo
                tabBarActiveTintColor: '#007bff', // cor do ícone e texto ativo
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    title: 'Visão Geral',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Transactions"
                component={TransactionsScreen}
                options={{
                    title: 'Transações',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Budgets"
                component={BudgetsScreen}
                options={{
                    title: 'Orçamentos',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    title: 'Relatórios',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;