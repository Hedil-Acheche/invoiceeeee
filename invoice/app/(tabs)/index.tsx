import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <View style={styles.left}>
            <Ionicons name="home" size={24} color="#A084DC" />
            <Text style={styles.title}>Home</Text>
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={() => alert('Search')}>
              <Ionicons name="search" size={24} color="#A084DC" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#F9B572" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Settings')}>
              <MaterialIcons name="settings" size={24} color="#A084DC" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dashboard}>
          <Text style={styles.dashboardTitle}>Invoice Dashboard</Text>
          <Text style={styles.subTitle}>Manage your invoices efficiently</Text>
          <View style={styles.dashboardStats}>
            <View style={styles.row}>
              <View style={[styles.statCard, styles.purpleCard]}>
                <Text style={styles.statLabel}>Pending</Text>
                <Text style={styles.statValue}>10</Text>
              </View>
              <View style={[styles.statCard, styles.orangeCard]}>
                <Text style={styles.statLabel}>Validated</Text>
                <Text style={styles.statValue}>15</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.statCard, styles.purpleCard]}>
                <Text style={styles.statLabel}>Paid</Text>
                <Text style={styles.statValue}>20</Text>
              </View>
              <View style={[styles.statCard, styles.orangeCard]}>
                <Text style={styles.statLabel}>Urgent</Text>
                <Text style={styles.statValue}>3</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push('/add-invoice')}>
            <Text style={styles.buttonText}>Add Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/invoices')}>
            <Text style={styles.buttonText}>View Invoices</Text>
          </TouchableOpacity>
        </View>
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
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.9,
  },
  icon: {
    marginLeft: 12,
  },
  dashboard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A084DC',
    marginBottom: 10,
    textAlign: 'center',
  },
  dashboardStats: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    padding: 12,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#444',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 6,
  },
  purpleCard: {
    backgroundColor: '#E3DFF5',
  },
  orangeCard: {
    backgroundColor: '#FFE8C8',
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: '#A084DC',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondary: {
    backgroundColor: '#F9B572',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
