import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <View style={styles.left}>
          <Ionicons name="person-circle-outline" size={32} color="#A084DC" />
          <Text style={styles.title}>Profil</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={() => alert('Recherche')}>
            <Feather name="search" size={24} color="#A084DC" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Notifications')}>
            <Feather name="bell" size={24} color="#F9B572" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Paramètres')}>
            <MaterialIcons name="settings" size={24} color="#A084DC" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Gérez votre compte et vos préférences</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>HA</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>Hedil Abir</Text>
            <Text style={styles.role}>Responsable Comptabilité</Text>
            <Text style={styles.email}>hadilabir@gmail.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="user" size={16} color="#333" />
            <Text style={styles.editText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box}>
          <View style={styles.row}>
            <Ionicons name="notifications-outline" size={22} color="#333" />
            <Text style={styles.rowText}>Notifications</Text>
            <View style={styles.badgeRed}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={22} color="#333" />
            <Text style={styles.rowText}>Messages</Text>
            <View style={styles.badgeGray}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </View>
        </View>

        <View style={styles.box}>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="settings-outline" size={22} color="#333" />
            <Text style={styles.rowText}>Paramètres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="help-circle-outline" size={22} color="#333" />
            <Text style={styles.rowText}>Aide et Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.row, styles.logoutRow]}>
          <Ionicons name="log-out-outline" size={22} color="#F9B572" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff8dc',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff8dc',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#A084DC'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    color: '#666',
    marginBottom: 16,
    fontSize: 15,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#A084DC',
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
  },
  userInfo: {
    marginTop: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    color: '#666',
    marginTop: 2,
  },
  email: {
    color: '#aaa',
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editText: {
    marginLeft: 6,
    color: '#333',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  badgeRed: {
    backgroundColor: '#F9B572',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeGray: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  logoutRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'flex-start',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutText: {
    color: '#F9B572',
    fontSize: 16,
    marginLeft: 12,
  },
});
