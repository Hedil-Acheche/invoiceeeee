import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { invoiceService } from '../api';

const STATUS_COLORS = {
  'Pending': '#F9B572',
  'Validated': '#A084DC',
  'Paid': '#FF6969',
};

const invoicesData = [
  { id: '1', company: 'Entreprise Martin', number: 'FAC-2023-001', date: '15/05/2023', amount: 1250.5, status: 'Pending' },
  { id: '2', company: 'Tech Solutions', number: 'FAC-2023-002', date: '18/05/2023', amount: 3750, status: 'Validated' },
  { id: '3', company: 'Bureau Pro', number: 'FAC-2023-003', date: '01/05/2023', amount: 875.25, status: 'Paid' },
  { id: '4', company: 'Librairie Centrale', number: 'FAC-2023-004', date: '22/05/2023', amount: 450, status: 'Pending' },
  { id: '5', company: 'Fournitures Express', number: 'FAC-2023-005', date: '25/05/2023', amount: 1200, status: 'Pending' },
  { id: '6', company: 'Design Moderne', number: 'FAC-2023-006', date: '27/05/2023', amount: 2800, status: 'Validated' },
  { id: '7', company: 'Transport Rapide', number: 'FAC-2023-007', date: '28/05/2023', amount: 650.75, status: 'Paid' },
];

export default function InvoicesScreen() {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Validated' | 'Paid'>('All');
  const [invoices, setInvoices] = useState<any[]>(invoicesData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = async () => {
    if (!refreshing) setLoading(true);
    try {
      const data = await invoiceService.getAllInvoices();
      if (data && data.success && data.invoices) {
        const fetched = data.invoices;
        setInvoices(fetched);
      } else {
        Alert.alert('Error', 'Failed to load invoices from server');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const combinedInvoices = [...invoicesData];
  invoices.forEach(inv => {
    if (!combinedInvoices.some(staticInv => staticInv.id === inv.id || ((inv as any)._id && staticInv.id === (inv as any)._id))) {
      combinedInvoices.push(inv);
    }
  });

  const combinedInvoicesTyped: any[] = combinedInvoices;

  const filteredInvoices = filter === 'All'
    ? combinedInvoicesTyped
    : combinedInvoicesTyped.filter(inv => inv.status === filter);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvoices();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <View style={styles.left}>
            <Ionicons name="document-text" size={30} color="#A084DC" />
            <Text style={styles.title}>Invoices</Text>
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={() => alert('Search')}>
              <Ionicons name="search" size={24} color="#A084DC" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#F9B572" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Settings')}>
              <MaterialIcons name="settings" size={24} color="#FF6969" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filters}>
          {['All', 'Pending', 'Validated', 'Paid'].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilter(status as any)}
              style={[styles.filterBtn, filter === status && styles.activeFilter]}
            >
              <Text style={[styles.filterText, filter === status && styles.activeFilterText]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#A084DC" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredInvoices}
            keyExtractor={(item) => item._id ? item._id.toString() : item.id.toString()}
            renderItem={({ item }) => {
              const isStatic = invoicesData.some(staticItem => staticItem.id === item.id);
              return (
                <TouchableOpacity
                  style={styles.invoiceCard}
                  onPress={() => {
                    if (isStatic) return;
                    import('expo-router').then(({ useRouter }) => {
                      const router = useRouter();
                      router.push(`/invoice_data?id=${item._id?.toString() || item.id.toString()}`);
                    });
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.company}>{item.company || (item as any).vendor_details?.name || 'Unknown'}</Text>
                    <Text style={styles.number}>N°{item.number || (item as any).invoice_number || ''}</Text>
                    <View style={styles.row}>
                      <Ionicons name="calendar-outline" size={16} color="#888" />
                      <Text style={styles.date}>{item.date || (item as any).invoice_date || ''}</Text>
                    </View>
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={styles.amount}>
                      {(item.amount || (item as any).total_amount)?.toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || '#999' },
                      ]}
                    >
                      <Text style={styles.statusText}>{item.status || 'Unknown'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff8dc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A084DC',
    marginLeft: 8,
  },
  icon: {
    marginLeft: 12,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterBtn: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilter: {
    backgroundColor: '#A084DC',
  },
  activeFilterText: {
    color: '#fff',
  },
  invoiceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  company: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  number: {
    color: '#666',
    marginTop: 2,
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  statusBadge: {
    marginTop: 6,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
});
