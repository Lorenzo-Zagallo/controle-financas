import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StackPainel      from './StackPainel';
import StackTransacao   from './StackTransacao';
import StackOrcamento   from './StackOrcamento';
import StackRelatorio   from './StackRelatorio';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator initialRouteName='AbaPainel'
            screenOptions={{
                headerShown: false, // esconde o cabecalho no topo
                tabBarActiveTintColor: '#007bff', // cor do ícone e texto ativo
                tabBarInactiveTintColor: 'gray', // cor do ícone e texto inativo
            }} >
            <Tab.Screen name="AbaPainel" component={StackPainel}
                options={{
                    title: 'Visão Geral', tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="AbaTransacoes" component={StackTransacao}
                options={{
                    title: 'Transações', tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="AbaOrcamentos" component={StackOrcamento}
                options={{
                    title: 'Orçamentos', tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="AbaRelatorio" component={StackRelatorio}
                options={{
                    title: 'Relatórios', tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" color={color} size={size} />
                    ),
                }} />
        </Tab.Navigator>
    );
};

export default TabNavigation;