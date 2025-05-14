import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Define the invoice data structure
interface InvoiceData {
  id?: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  status: 'pending' | 'validated' | 'paid';
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export default function InvoiceData() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  
  // Fetch invoices from backend
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/api/invoices');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setInvoices(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      setError('Failed to load invoices. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const handleSelectInvoice = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
  };

  const handleUpdateInvoice = async () => {
    if (!selectedInvoice) return;
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:3000/api/invoices/${selectedInvoice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedInvoice),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      Alert.alert('Success', 'Invoice updated successfully');
      fetchInvoices(); // Refresh the list
      setSelectedInvoice(null);
    } catch (err) {
      console.error('Failed to update invoice:', err);
      Alert.alert('Error', 'Failed to update invoice. Please try again.');
    }
  };

  // Update invoice field
  const updateField = (field: keyof InvoiceData, value: any) => {
    if (!selectedInvoice) return;
    
    setSelectedInvoice({
      ...selectedInvoice,
      [field]: value,
    });
  };

  // Update invoice item field
  const updateItemField = (index: number, field: keyof InvoiceItem, value: any) => {
    if (!selectedInvoice) return;
    
    const updatedItems = [...selectedInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    
    // Recalculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].amount = 
        updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    // Recalculate total
    const total = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    
    setSelectedInvoice({
      ...selectedInvoice,
      items: updatedItems,
      total,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#A084DC" />
        <Text style={styles.loadingText}>Loading invoice data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchInvoices}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff8dc' }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#A084DC" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Invoice Data</Text>
        </View>

        {!selectedInvoice ? (
          // Invoice List View
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Invoices</Text>
            {invoices.length === 0 ? (
              <Text style={styles.emptyText}>No invoices found</Text>
            ) : (
              invoices.map((invoice, index) => (
                <TouchableOpacity 
                  key={invoice.id || index} 
                  style={styles.invoiceCard}
                  onPress={() => handleSelectInvoice(invoice)}
                >
                  <View style={styles.invoiceHeader}>
                    <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
                    <View style={[
                      styles.statusBadge, 
                      invoice.status === 'pending' ? styles.pendingBadge : 
                      invoice.status === 'validated' ? styles.validatedBadge : 
                      styles.paidBadge
                    ]}>
                      <Text style={styles.statusText}>{invoice.status}</Text>
                    </View>
                  </View>
                  <View style={styles.invoiceDetails}>
                    <Text style={styles.clientName}>{invoice.clientName}</Text>
                    <Text style={styles.dateText}>
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.invoiceFooter}>
                    <Text style={styles.totalText}>Total: ${invoice.total.toFixed(2)}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#A084DC" />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          // Invoice Detail View
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Invoice</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Invoice Number</Text>
              <TextInput
                style={styles.input}
                value={selectedInvoice.invoiceNumber}
                onChangeText={(value) => updateField('invoiceNumber', value)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Client Name</Text>
              <TextInput
                style={styles.input}
                value={selectedInvoice.clientName}
                onChangeText={(value) => updateField('clientName', value)}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Client Email</Text>
              <TextInput
                style={styles.input}
                value={selectedInvoice.clientEmail}
                onChangeText={(value) => updateField('clientEmail', value)}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Issue Date</Text>
                <TextInput
                  style={styles.input}
                  value={selectedInvoice.issueDate}
                  onChangeText={(value) => updateField('issueDate', value)}
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Due Date</Text>
                <TextInput
                  style={styles.input}
                  value={selectedInvoice.dueDate}
                  onChangeText={(value) => updateField('dueDate', value)}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusSelector}>
                <TouchableOpacity 
                  onPress={() => updateField('status', 'pending')} 
                  style={[
                    styles.statusOption, 
                    selectedInvoice.status === 'pending' && styles.selectedStatus
                  ]}
                >
                  <Text style={[
                    styles.statusOptionText,
                    selectedInvoice.status === 'pending' && styles.selectedStatusText
                  ]}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => updateField('status', 'validated')} 
                  style={[
                    styles.statusOption, 
                    selectedInvoice.status === 'validated' && styles.selectedStatus
                  ]}
                >
                  <Text style={[
                    styles.statusOptionText,
                    selectedInvoice.status === 'validated' && styles.selectedStatusText
                  ]}>Validated</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => updateField('status', 'paid')} 
                  style={[
                    styles.statusOption, 
                    selectedInvoice.status === 'paid' && styles.selectedStatus
                  ]}
                >
                  <Text style={[
                    styles.statusOptionText,
                    selectedInvoice.status === 'paid' && styles.selectedStatusText
                  ]}>Paid</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={[styles.label, { marginTop: 20 }]}>Items</Text>
            {selectedInvoice.items.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.input}
                    value={item.description}
                    onChangeText={(value) => updateItemField(index, 'description', value)}
                  />
                </View>
                
                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      value={item.quantity.toString()}
                      onChangeText={(value) => updateItemField(index, 'quantity', parseFloat(value) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Unit Price</Text>
                    <TextInput
                      style={styles.input}
                      value={item.unitPrice.toString()}
                      onChangeText={(value) => updateItemField(index, 'unitPrice', parseFloat(value) || 0)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Amount</Text>
                  <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
                </View>
              </View>
            ))}
            
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${selectedInvoice.total.toFixed(2)}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setSelectedInvoice(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleUpdateInvoice}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8dc',
    paddingHorizontal: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A084DC',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#A084DC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  invoiceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  pendingBadge: {
    backgroundColor: '#FFF0D9',
  },
  validatedBadge: {
    backgroundColor: '#E3DFF5',
  },
  paidBadge: {
    backgroundColor: '#D7F9E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  invoiceDetails: {
    marginBottom: 12,
  },
  clientName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedStatus: {
    backgroundColor: '#A084DC',
  },
  statusOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedStatusText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 12,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A084DC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#A084DC',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});